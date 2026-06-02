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

const analysisSteps = [
  { label: "Fetching playlist data", icon: Video },
  { label: "Analyzing video content", icon: Brain },
  { label: "Generating course structure", icon: BookOpen },
  { label: "Creating AI summaries", icon: FileText },
  { label: "Generating flashcards & quizzes", icon: HelpCircle },
];

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [currentStep, setCurrentStep] = useState(0);

  const handleGenerate = async () => {
    if (!url.trim()) return;
    setStatus("loading");
    setCurrentStep(0);

    for (let i = 0; i < analysisSteps.length; i++) {
      await new Promise((res) => setTimeout(res, 1200));
      setCurrentStep(i + 1);
    }

    await new Promise((res) => setTimeout(res, 600));
    setStatus("done");
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
                  Complete Web Development Bootcamp 2026
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Master HTML, CSS, JavaScript, React, Node.js and more in this comprehensive bootcamp.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Modules", value: "8", icon: BookOpen },
                    { label: "Lessons", value: "42", icon: FileText },
                    { label: "Duration", value: "24h", icon: Clock },
                    { label: "Flashcards", value: "120", icon: Layers },
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
                  {[
                    "Getting Started with Web Development",
                    "HTML & CSS Fundamentals",
                    "JavaScript Deep Dive",
                    "React & Modern Frontend",
                  ].map((mod, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600 py-1.5"
                    >
                      <span className="w-6 h-6 rounded-md bg-primary-light text-primary text-xs font-medium flex items-center justify-center">
                        {i + 1}
                      </span>
                      {mod}
                    </div>
                  ))}
                  <p className="text-xs text-gray-400">+ 4 more modules</p>
                </div>

                <Link
                  href="/dashboard/course/course-1"
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
