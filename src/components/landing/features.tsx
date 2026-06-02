"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  BarChart3,
  Sparkles,
  Layers,
  Target,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Import Playlists",
    description:
      "Paste any YouTube playlist or channel URL and instantly transform it into a structured course with organized modules.",
    color: "#2563EB",
    bg: "#dbeafe",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description:
      "Monitor your learning journey with detailed analytics, streak tracking, and completion stats across all courses.",
    color: "#10B981",
    bg: "#d1fae5",
  },
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description:
      "Get AI-generated summaries, key takeaways, and study materials for every lesson automatically.",
    color: "#8B5CF6",
    bg: "#ede9fe",
  },
  {
    icon: Target,
    title: "Interactive Quizzes",
    description:
      "Test your understanding with AI-generated quizzes featuring timed questions, scoring, and detailed explanations.",
    color: "#EF4444",
    bg: "#fee2e2",
  },
  {
    icon: Layers,
    title: "Smart Flashcards",
    description:
      "Study with AI-generated flashcard decks. Flip, review, and track mastery to reinforce your learning.",
    color: "#F59E0B",
    bg: "#fef3c7",
  },
  {
    icon: Sparkles,
    title: "Course Structure",
    description:
      "Automatically organized modules, ordered lessons, estimated durations, and a clear learning path.",
    color: "#06B6D4",
    bg: "#cffafe",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-sm font-medium">
            Features
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
            Everything you need to learn effectively
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            From importing playlists to tracking progress, EduFlow gives you a
            complete learning toolkit powered by AI.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="card card-interactive p-6 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: feature.bg }}
              >
                <feature.icon
                  className="w-6 h-6"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
