"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle,
  Circle,
  PlayCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ArrowRight,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";

export default function CourseLearningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { courses, toggleLessonComplete } = useAppStore();
  const course = courses.find((c) => c.id === id);

  const [expandedModule, setExpandedModule] = useState<string | null>(
    course?.modules[0]?.id || null
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    () => {
      if (!course) return null;
      // Find first incomplete lesson
      for (const mod of course.modules) {
        const incomplete = mod.lessons.find((l) => !l.completed);
        if (incomplete) return incomplete.id;
      }
      return course.modules[0]?.lessons[0]?.id || null;
    }
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Course not found
          </h2>
          <Link href="/dashboard/courses" className="btn btn-primary mt-4">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const selectedLesson = allLessons.find((l) => l.id === selectedLessonId);
  const currentIndex = allLessons.findIndex((l) => l.id === selectedLessonId);
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const completedCount = allLessons.filter((l) => l.completed).length;

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center gap-4">
        <Link
          href="/dashboard/courses"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-medium text-gray-900 truncate">
            {course.title}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>
            {completedCount}/{allLessons.length} lessons
          </span>
          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: `${(completedCount / allLessons.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Module Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-80" : "w-0"
          } hidden md:block shrink-0 border-r border-gray-200 bg-white overflow-y-auto transition-all duration-300 h-[calc(100vh-3.5rem)] sticky top-14`}
        >
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Course Content
            </h2>
            <div className="space-y-1">
              {course.modules.map((mod, modIndex) => {
                const modCompleted = mod.lessons.filter(
                  (l) => l.completed
                ).length;
                const isExpanded = expandedModule === mod.id;

                return (
                  <div key={mod.id}>
                    <button
                      onClick={() =>
                        setExpandedModule(isExpanded ? null : mod.id)
                      }
                      className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                          isExpanded ? "" : "-rotate-90"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {mod.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {modCompleted}/{mod.lessons.length} completed
                        </p>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="ml-4 pl-4 border-l border-gray-100 space-y-0.5 mt-1 mb-2">
                        {mod.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLessonId(lesson.id)}
                            className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all text-sm ${
                              selectedLessonId === lesson.id
                                ? "bg-primary-light text-primary"
                                : "hover:bg-gray-50 text-gray-600"
                            }`}
                          >
                            {lesson.completed ? (
                              <CheckCircle className="w-4 h-4 text-success shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                            )}
                            <span className="truncate flex-1">
                              {lesson.title}
                            </span>
                            <span className="text-xs text-gray-400 shrink-0">
                              {lesson.duration}m
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {selectedLesson ? (
            <motion.div
              key={selectedLesson.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 py-6"
            >
              {/* Video Placeholder */}
              <div className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                <div className="relative z-10 text-center">
                  <PlayCircle className="w-16 h-16 text-white/50 mx-auto mb-3" />
                  <p className="text-white/70 text-sm">
                    Video Player — {selectedLesson.title}
                  </p>
                </div>
              </div>

              {/* Lesson Info */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {selectedLesson.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedLesson.duration} min
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toggleLessonComplete(course.id, selectedLesson.id)
                  }
                  className={`btn shrink-0 ${
                    selectedLesson.completed
                      ? "bg-success-light text-success border border-success/20"
                      : "btn-primary"
                  }`}
                >
                  {selectedLesson.completed ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      Mark Complete
                    </>
                  )}
                </button>
              </div>

              {/* AI Summary */}
              <div className="card p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  AI Summary
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedLesson.summary}
                </p>
              </div>

              {/* Resources */}
              {selectedLesson.resources.length > 0 && (
                <div className="card p-5 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Resources
                  </h3>
                  <div className="space-y-2">
                    {selectedLesson.resources.map((res, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {res}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Lesson */}
              {nextLesson && (
                <button
                  onClick={() => setSelectedLessonId(nextLesson.id)}
                  className="card card-interactive flex items-center gap-4 p-4 w-full group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs text-gray-400">Next Lesson</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {nextLesson.title}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                </button>
              )}

              {/* Mobile module list */}
              <div className="md:hidden mt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Course Content
                </h3>
                <div className="space-y-1">
                  {course.modules.map((mod) => (
                    <div key={mod.id} className="card overflow-hidden mb-2">
                      <button
                        onClick={() =>
                          setExpandedModule(
                            expandedModule === mod.id ? null : mod.id
                          )
                        }
                        className="w-full flex items-center gap-2 p-3 text-left"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            expandedModule === mod.id ? "" : "-rotate-90"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                          {mod.title}
                        </span>
                      </button>
                      {expandedModule === mod.id && (
                        <div className="px-3 pb-3 space-y-1">
                          {mod.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLessonId(lesson.id)}
                              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm ${
                                selectedLessonId === lesson.id
                                  ? "bg-primary-light text-primary"
                                  : "text-gray-600"
                              }`}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="w-4 h-4 text-success shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <p className="text-gray-500">Select a lesson to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
