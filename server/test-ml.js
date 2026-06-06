import { getTranscript, extractKeywords, getEmbedding, clusterVideos, generateModuleTitle } from "./ml.js";

async function run() {
  try {
    console.log("Fetching transcript...");
    let text = await getTranscript("dQw4w9WgXcQ"); // Never gonna give you up
    if (!text) text = "Rick Astley - Never Gonna Give You Up (Official Music Video)";
    
    console.log("Transcript length:", text.length);
    
    console.log("Extracting keywords...");
    const keywords = extractKeywords(text);
    console.log("Keywords:", keywords);
    
    console.log("Generating embedding...");
    const embedding = await getEmbedding(text.slice(0, 500));
    console.log("Embedding length:", embedding.length);
    
    console.log("Test successful!");
  } catch (e) {
    console.error("Test failed:", e);
  }
}

run();
