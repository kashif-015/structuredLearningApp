"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  BarChart3,
  Sparkles,
  Layers,
  Target,
  Play,
  FileText,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Video,
} from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const workflowSteps = [
  { icon: Video, label: "YouTube Playlist", color: "#EF4444", bg: "#fee2e2" },
  { icon: Brain, label: "AI Analysis", color: "#8B5CF6", bg: "#ede9fe" },
  { icon: BookOpen, label: "Structured Course", color: "#2563EB", bg: "#dbeafe" },
  { icon: FileText, label: "Smart Notes", color: "#10B981", bg: "#d1fae5" },
  { icon: HelpCircle, label: "Interactive Quiz", color: "#F59E0B", bg: "#fef3c7" },
  { icon: Layers, label: "Flashcards", color: "#EC4899", bg: "#fce7f3" },
  { icon: TrendingUp, label: "Track Progress", color: "#06B6D4", bg: "#cffafe" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 animate-gradient"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.3) 0%, rgba(96,165,250,0.1) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15 animate-gradient"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(168,85,247,0.1) 50%, transparent 70%)",
            animationDelay: "2s",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--gray-900) 1px, transparent 1px), linear-gradient(90deg, var(--gray-900) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium border border-primary/10">
                <Sparkles className="w-4 h-4" />
                The Future of YouTube Learning
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]"
            >
              Transform YouTube Into{" "}
              <span className="gradient-text">Structured Courses</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg sm:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Turn any playlist or channel into a complete learning experience
              with AI-powered notes, quizzes, flashcards and progress tracking.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/auth"
                className="btn btn-primary btn-lg group"
              >
                Start Learning
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="btn btn-secondary btn-lg group">
                <Play className="w-5 h-5 text-primary" />
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-success" />
                Free to start
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-success" />
                No credit card
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-success" />
                AI-powered
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Animated workflow */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.12, duration: 0.5 }}
                >
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow cursor-default"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: step.bg }}
                    >
                      <step.icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{step.label}</p>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                    )}
                    {index === workflowSteps.length - 1 && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className="ml-9 h-3 border-l-2 border-dashed border-gray-200" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
