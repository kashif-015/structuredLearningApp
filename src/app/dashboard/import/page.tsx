"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Sparkles,
  CheckCircle,
  Clock,
  BookOpen,
  Layers,
  ArrowRight,
  Loader2,
  Video,
  Brain,
  FileText,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { resolveYouTubeUrl, importPlaylistAsCourse } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import type { Course } from "@/lib/mock-data";

const analysisSteps = [
  { label: "Fetching playlist data", icon: Video },
  { label: "Analyzing video content", icon: Brain },
  { label: "Generating course structure", icon: BookOpen },
  { label: "Creating AI summaries", icon: FileText },
  { label: "Generating flashcards & quizzes", icon: HelpCircle },
];

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [importedCourse, setImportedCourse] = useState<Course | null>(null);
  const { importCourse } = useAppStore();

  const handleGenerate = async () => {
    if (!url.trim()) return;
    setStatus("loading");
    setCurrentStep(0);
    setErrorMsg("");

    try {
      // Step 1: Resolve URL
      setCurrentStep(0);
      const resolveData = await resolveYouTubeUrl(url);
      
      let playlistId = "";
      if (resolveData.type === "playlist") {
        playlistId = resolveData.id;
      } else {
        throw new Error("Currently only playlist URLs are fully supported for automatic course generation. Please paste a playlist URL.");
      }

      // Step 2: Fetch and analyze playlist
      setCurrentStep(1);
      const courseData = await importPlaylistAsCourse(playlistId);

      // Step 3: Generate course structure
      setCurrentStep(2);
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: courseData.title,
        description: `Imported from YouTube channel: ${courseData.channel}`,
        author: courseData.channel,
        category: "Imported",
        rating: 0,
        thumbnail: courseData.thumbnail || "",
        lastAccessed: new Date().toISOString().split("T")[0],
        enrolledDate: new Date().toISOString().split("T")[0],
        totalDuration: courseData.totalDuration,
        progress: 0,
        playlistId: playlistId,
        modules: courseData.modules.map((m: any) => ({
          id: m.id,
          title: m.title,
          lessons: m.lectures.map((l: any) => ({
            id: l.id,
            title: l.title,
            duration: Math.round(l.duration / 60),
            videoId: l.videoId,
            position: l.position,
            completed: false,
            resources: [`https://youtube.com/watch?v=${l.videoId}`],
            summary: "AI summary pending...",
          }))
        }))
      };

      importCourse(newCourse);
      setImportedCourse(newCourse);
      
      setCurrentStep(5); // Complete all visual steps
      setStatus("done");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to import playlist.");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Import Playlist
        </h1>
        <p className="mt-2 text-gray-500">
          Paste a YouTube playlist or channel URL to generate a structured course
        </p>
      </motion.div>

      {/* URL Input */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-8 card p-6"
      >
        <label
          htmlFor="playlist-url"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          YouTube Playlist URL
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="playlist-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/playlist?list=..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              disabled={status === "loading"}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={!url.trim() || status === "loading"}
            className="btn btn-primary h-11 px-6 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Generate Course</span>
                <span className="sm:hidden">Generate</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "https://youtube.com/playlist?list=PLu0W_9lII9agICnT8t4iYVSZ3eykIAOME",
            "https://youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3",
          ].map((sample, i) => (
            <button
              key={i}
              onClick={() => setUrl(sample)}
              className="text-xs text-gray-400 hover:text-primary bg-gray-50 hover:bg-primary-light px-3 py-1.5 rounded-lg transition-all"
            >
              Sample {i + 1}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Analysis Progress */}
      <AnimatePresence>
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-6 card p-6"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              AI Analysis in Progress
            </h3>
            <div className="space-y-4">
              {analysisSteps.map((step, i) => {
                const isComplete = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <div key={step.label} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isComplete
                          ? "bg-success-light"
                          : isActive
                          ? "bg-primary-light"
                          : "bg-gray-100"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : (
                        <step.icon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isComplete
                          ? "text-success font-medium"
                          : isActive
                          ? "text-primary font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-6 card p-6 border-danger/30 bg-danger-light/20"
          >
            <h3 className="text-sm font-semibold text-danger mb-2 flex items-center gap-2">
              Import Failed
            </h3>
            <p className="text-sm text-danger/80">{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Course Preview */}
      <AnimatePresence>
        {status === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="card p-6 border-success/30 bg-success-light/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Course Generated Successfully!
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your course is ready to start learning
                  </p>
                </div>
              </div>

              <div className="card p-5 bg-white">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {importedCourse?.title}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {importedCourse?.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Modules", value: importedCourse?.modules.length || 0, icon: BookOpen },
                    { label: "Lessons", value: importedCourse?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0, icon: FileText },
                    { label: "Duration", value: formatDuration(importedCourse?.totalDuration || 0), icon: Clock },
                    { label: "Flashcards", value: "Auto", icon: Layers },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-xl bg-gray-50">
                      <stat.icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="text-sm font-medium text-gray-700">Modules Preview</h5>
                  {importedCourse?.modules.slice(0, 4).map((mod, i) => (
                    <div
                      key={mod.id}
                      className="flex items-center gap-2 text-sm text-gray-600 py-1.5"
                    >
                      <span className="w-6 h-6 rounded-md bg-primary-light text-primary text-xs font-medium flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="truncate">{mod.title}</span>
                    </div>
                  ))}
                  {(importedCourse?.modules.length || 0) > 4 && (
                    <p className="text-xs text-gray-400">+ {(importedCourse?.modules.length || 0) - 4} more modules</p>
                  )}
                </div>

                <Link
                  href={`/dashboard/course/${importedCourse?.id}`}
                  className="btn btn-primary w-full"
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
