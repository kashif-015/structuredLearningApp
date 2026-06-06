import { pipeline, env } from "@huggingface/transformers";
import { YoutubeTranscript } from "youtube-transcript";
import natural from "natural";
import { agnes } from "ml-hclust";
import fs from "fs";
import path from "path";

env.allowLocalModels = false;
env.useBrowserCache = false;

const CACHE_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

function getCache(key) {
  const file = path.join(CACHE_DIR, `${key}.json`);
  try { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null; }
  catch { return null; }
}
function setCache(key, data) {
  fs.writeFileSync(path.join(CACHE_DIR, `${key}.json`), JSON.stringify(data));
}

// ── Singleton embedding model ──────────────────────────────
let extractor;
async function getExtractor() {
  if (!extractor) {
    console.log("Loading all-MiniLM-L6-v2...");
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("Model loaded!");
  }
  return extractor;
}

// ── Transcript ─────────────────────────────────────────────
export async function getTranscript(videoId) {
  const cached = getCache(`transcript_${videoId}`);
  if (cached) return cached.text;
  try {
    const parts = await YoutubeTranscript.fetchTranscript(videoId);
    const text = parts.map(t => t.text).join(" ").replace(/\s+/g, " ").trim();
    setCache(`transcript_${videoId}`, { text });
    return text;
  } catch (e) {
    console.warn(`No transcript for ${videoId}: ${e.message}`);
    return null;
  }
}

// ── Keyword extraction (TF-IDF style) ─────────────────────
const STOP = new Set(["the","and","a","to","of","in","i","is","that","it","on","you","this","for","but","with","are","have","be","at","or","as","was","so","if","out","not","we","my","about","what","like","just","can","do","they","your","all","up","how","when","there","one","more","from","by","some","which","will","an","their","them","would","then","has","these","because","get","going","really","very","see","know","think","make","here","well","now","its","also","been","into","than","other","time","only","new","use","used","using","way","each","first","two","may","said","any","did","he","she","his","her","our","us","those","where","after","before","between"]);

export function extractKeywords(text, n = 15) {
  const words = new natural.WordTokenizer().tokenize(text.toLowerCase());
  const counts = {};
  for (const w of words) {
    if (w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w))
      counts[w] = (counts[w] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n).map(k => k[0]);
}

// ── Embeddings (cached per videoId) ───────────────────────
export async function getEmbedding(videoId, text) {
  const cached = getCache(`embedding_${videoId}`);
  if (cached) return cached.embedding;
  const model = await getExtractor();
  const out = await model(text, { pooling: "mean", normalize: true });
  const embedding = Array.from(out.data);
  setCache(`embedding_${videoId}`, { embedding });
  return embedding;
}

// ── Clustering ─────────────────────────────────────────────
function cosineDistance(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return Math.max(0, 1 - dot);
}

function getNumClusters(total) {
  if (total >= 50) return Math.min(12, Math.max(8, Math.floor(total / 6)));
  if (total >= 26) return Math.min(8,  Math.max(5, Math.floor(total / 5)));
  if (total >= 11) return Math.min(5,  Math.max(3, Math.floor(total / 4)));
  return Math.min(3, Math.max(2, Math.floor(total / 3)));
}

function getLeaves(node) {
  if (node.isLeaf) return [node.index];
  return [...getLeaves(node.children[0]), ...getLeaves(node.children[1])];
}

function cutTree(root, k) {
  let clusters = [root];
  while (clusters.length < k) {
    let maxH = -1, idx = -1;
    for (let i = 0; i < clusters.length; i++) {
      if (!clusters[i].isLeaf && clusters[i].height > maxH) { maxH = clusters[i].height; idx = i; }
    }
    if (idx === -1) break;
    const n = clusters[idx];
    clusters.splice(idx, 1, n.children[0], n.children[1]);
  }
  return clusters;
}

export function clusterVideos(videos) {
  const total = videos.length;
  if (total <= 2) return [videos];

  const k = Math.min(getNumClusters(total), total);
  const embeddings = videos.map(v => v.embedding);

  try {
    const tree = agnes(embeddings, { distanceFunction: cosineDistance, method: "average" });
    return cutTree(tree, k).map(node =>
      getLeaves(node).map(i => videos[i]).sort((a, b) => a.position - b.position)
    );
  } catch (err) {
    console.warn("Clustering fallback:", err.message);
    // Equal-size fallback
    const size = Math.ceil(total / k);
    const result = [];
    for (let i = 0; i < total; i += size) result.push(videos.slice(i, i + size));
    return result;
  }
}

// ── Module title from cluster keywords ────────────────────
export function generateModuleTitle(clusterVideos) {
  const allKws = clusterVideos.flatMap(v => v.keywords || []);
  if (allKws.length === 0) {
    // fallback: use video title words
    const words = clusterVideos.flatMap(v =>
      v.title.split(/\s+/).filter(w => w.length > 3).map(w => w.replace(/[^a-zA-Z]/g, "").toLowerCase())
    ).filter(Boolean);
    const c = {}; words.forEach(w => c[w] = (c[w] || 0) + 1);
    const top = Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0].charAt(0).toUpperCase()+x[0].slice(1));
    return top.join(" & ") || "General Topics";
  }
  const c = {}; allKws.forEach(k => c[k] = (c[k] || 0) + 1);
  const top = Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0].charAt(0).toUpperCase()+x[0].slice(1));
  if (top.length === 1) return `${top[0]} Fundamentals`;
  if (top.length === 2) return `${top[0]} & ${top[1]}`;
  return `${top[0]}, ${top[1]} & ${top[2]}`;
}
