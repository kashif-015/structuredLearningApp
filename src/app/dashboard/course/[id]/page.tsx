"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Loader2,
  Sparkles,
  HelpCircle,
  Layers,
  X,
  Brain,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import { generateSummary, generateQuiz, generateFlashcards } from "@/lib/api";

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
  // AI Tools state
  const [aiToolsOpen, setAiToolsOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiQuiz, setAiQuiz] = useState<any[] | null>(null);
  const [aiFlashcards, setAiFlashcards] = useState<any[] | null>(null);
  const [activeAiTab, setActiveAiTab] = useState<"summary" | "quiz" | "flashcards" | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [flashcardFlipped, setFlashcardFlipped] = useState<Set<number>>(new Set());

  const resetAiState = () => {
    setAiSummary(null);
    setAiQuiz(null);
    setAiFlashcards(null);
    setActiveAiTab(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setFlashcardFlipped(new Set());
  };

  const handleSummarize = async () => {
    if (!selectedLesson || !course) return;
    setActiveAiTab("summary");
    setAiLoading("summary");
    try {
      const summary = await generateSummary(selectedLesson.title, `A lecture from the course ${course.title}`);
      setAiSummary(summary);
    } catch { setAiSummary("Failed to generate summary."); }
    finally { setAiLoading(null); }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedLesson) return;
    setActiveAiTab("quiz");
    setAiLoading("quiz");
    setQuizAnswers({});
    setQuizSubmitted(false);
    try {
      const quiz = await generateQuiz(selectedLesson.title);
      setAiQuiz(quiz);
    } catch { setAiQuiz(null); }
    finally { setAiLoading(null); }
  };

  const handleGenerateFlashcards = async () => {
    if (!selectedLesson) return;
    setActiveAiTab("flashcards");
    setAiLoading("flashcards");
    setFlashcardFlipped(new Set());
    try {
      const cards = await generateFlashcards(selectedLesson.title);
      setAiFlashcards(cards);
    } catch { setAiFlashcards(null); }
    finally { setAiLoading(null); }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h2>
          <Link href="/dashboard/courses" className="btn btn-primary mt-4">Back to Courses</Link>
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
        <div className="flex-1 min-w-0 pr-2">
          <h1 className="text-sm font-medium text-gray-900 truncate">
            {course.title}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
          <span className="hidden sm:inline">
            {completedCount}/{allLessons.length} lessons
          </span>
          <span className="sm:hidden">
            {completedCount}/{allLessons.length}
          </span>
          <div className="w-12 sm:w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
              {/* Video Player */}
              <div className="w-full aspect-video bg-gray-950 rounded-2xl mb-6 overflow-hidden shadow-lg">
                {selectedLesson.videoId ? (
                  <iframe
                    key={selectedLesson.videoId}
                    className="w-full h-full border-0"
                    src={`https://www.youtube-nocookie.com/embed/${selectedLesson.videoId}?rel=0&modestbranding=1${course.playlistId ? `&list=${course.playlistId}` : ""}${selectedLesson.position ? `&index=${selectedLesson.position}` : ""}`}
                    title={selectedLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center">
                      <PlayCircle className="w-16 h-16 text-white/40 mx-auto mb-3" />
                      <p className="text-white/60 text-sm">{selectedLesson.title}</p>
                    </div>
                  </div>
                )}
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
                  className={`btn shrink-0 w-full sm:w-auto justify-center ${
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

              {/* AI Tools Button */}
              <div className="mb-6">
                <button
                  onClick={() => { setAiToolsOpen(!aiToolsOpen); if (aiToolsOpen) resetAiState(); }}
                  className={`btn w-full justify-center gap-2 h-11 text-sm font-medium transition-all ${
                    aiToolsOpen
                      ? "bg-primary text-white"
                      : "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 hover:from-primary/20 hover:to-accent/20"
                  }`}
                >
                  {aiToolsOpen ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  {aiToolsOpen ? "Close AI Tools" : "AI Tools"}
                </button>

                <AnimatePresence>
                  {aiToolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      {/* Tool Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <button onClick={handleSummarize} disabled={aiLoading !== null}
                          className={`card card-interactive p-4 text-center transition-all ${
                            activeAiTab === "summary" ? "ring-2 ring-primary bg-primary-light" : ""
                          } disabled:opacity-50`}>
                          <Brain className="w-5 h-5 mx-auto mb-2 text-primary" />
                          <span className="text-xs font-medium text-gray-700">Summarize Lecture</span>
                        </button>
                        <button onClick={handleGenerateQuiz} disabled={aiLoading !== null}
                          className={`card card-interactive p-4 text-center transition-all ${
                            activeAiTab === "quiz" ? "ring-2 ring-primary bg-primary-light" : ""
                          } disabled:opacity-50`}>
                          <HelpCircle className="w-5 h-5 mx-auto mb-2 text-accent" />
                          <span className="text-xs font-medium text-gray-700">Generate Quiz</span>
                        </button>
                        <button onClick={handleGenerateFlashcards} disabled={aiLoading !== null}
                          className={`card card-interactive p-4 text-center transition-all ${
                            activeAiTab === "flashcards" ? "ring-2 ring-primary bg-primary-light" : ""
                          } disabled:opacity-50`}>
                          <Layers className="w-5 h-5 mx-auto mb-2 text-success" />
                          <span className="text-xs font-medium text-gray-700">Create Flashcards</span>
                        </button>
                      </div>

                      {/* Loading State */}
                      {aiLoading && (
                        <div className="card p-6 mt-4 flex items-center justify-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          <span className="text-sm text-gray-500">
                            {aiLoading === "summary" ? "Generating summary..." : aiLoading === "quiz" ? "Creating quiz questions..." : "Building flashcards..."}
                          </span>
                        </div>
                      )}

                      {/* Summary Result */}
                      {activeAiTab === "summary" && aiSummary && !aiLoading && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 mt-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-primary" /> AI Summary
                          </h3>
                          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{aiSummary}</div>
                        </motion.div>
                      )}

                      {/* Quiz Result */}
                      {activeAiTab === "quiz" && aiQuiz && !aiLoading && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 mt-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-accent" /> Quiz — {aiQuiz.length} Questions
                          </h3>
                          <div className="space-y-5">
                            {aiQuiz.map((q: any, qi: number) => (
                              <div key={qi}>
                                <p className="text-sm font-medium text-gray-900 mb-2">{qi + 1}. {q.question}</p>
                                <div className="space-y-2">
                                  {q.options.map((opt: string, oi: number) => {
                                    const isSelected = quizAnswers[qi] === oi;
                                    const isCorrect = quizSubmitted && opt === q.correct_answer;
                                    const isWrong = quizSubmitted && isSelected && opt !== q.correct_answer;
                                    return (
                                      <button key={oi} disabled={quizSubmitted}
                                        onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                                        className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                                          isCorrect ? "border-success bg-success-light/50 text-success" :
                                          isWrong ? "border-danger bg-danger-light/50 text-danger" :
                                          isSelected ? "border-primary bg-primary-light text-primary" :
                                          "border-gray-200 hover:border-primary/30 text-gray-600"
                                        }`}>
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                          {!quizSubmitted ? (
                            <button onClick={() => setQuizSubmitted(true)}
                              disabled={Object.keys(quizAnswers).length < aiQuiz.length}
                              className="btn btn-primary w-full mt-4 disabled:opacity-50">Check Answers</button>
                          ) : (
                            <div className="mt-4 p-4 rounded-xl bg-primary-light text-center">
                              <p className="text-lg font-bold text-primary">
                                {aiQuiz.filter((q: any, i: number) => q.options[quizAnswers[i]] === q.correct_answer).length}/{aiQuiz.length} Correct
                              </p>
                              <button onClick={handleGenerateQuiz} className="btn btn-ghost text-sm mt-2">Retry</button>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Flashcards Result */}
                      {activeAiTab === "flashcards" && aiFlashcards && !aiLoading && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
                          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-success" /> {aiFlashcards.length} Flashcards
                          </h3>
                          {aiFlashcards.map((card: any, ci: number) => (
                            <button key={ci} onClick={() => setFlashcardFlipped(prev => {
                              const next = new Set(prev);
                              next.has(ci) ? next.delete(ci) : next.add(ci);
                              return next;
                            })} className="card p-4 w-full text-left transition-all hover:shadow-md">
                              <div className="flex items-start gap-3">
                                <span className="w-7 h-7 rounded-lg bg-primary-light text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{ci + 1}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">{card.question}</p>
                                  <AnimatePresence>
                                    {flashcardFlipped.has(ci) && (
                                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                        className="text-sm text-primary mt-2 pt-2 border-t border-gray-100">{card.answer}</motion.p>
                                    )}
                                  </AnimatePresence>
                                  {!flashcardFlipped.has(ci) && <p className="text-xs text-gray-400 mt-1">Tap to reveal</p>}
                                </div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
