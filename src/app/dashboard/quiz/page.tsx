"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Target,
} from "lucide-react";
import { mockQuizzes, type Quiz, type QuizQuestion } from "@/lib/mock-data";
import Link from "next/link";

export default function QuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const quiz = mockQuizzes.find((q) => q.id === selectedQuiz);

  // Timer
  useEffect(() => {
    if (!quizStarted || showResult || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          setShowResult(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizStarted, showResult, timeRemaining]);

  const startQuiz = useCallback((q: Quiz) => {
    setSelectedQuiz(q.id);
    setCurrentQ(0);
    setAnswers({});
    setShowResult(false);
    setShowFeedback(false);
    setTimeRemaining(q.timeLimit);
    setQuizStarted(true);
  }, []);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    if (answers[questionId] !== undefined) return; // Already answered
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!quiz) return;
    setShowFeedback(false);
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      setShowResult(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Quiz selection screen
  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Quizzes
          </h1>
          <p className="mt-1 text-gray-500">
            Test your knowledge with AI-generated quizzes
          </p>
        </motion.div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockQuizzes.map((q, index) => (
            <motion.button
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onClick={() => startQuiz(q)}
              className="card card-interactive p-5 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {q.title}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{q.courseName}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{q.questions.length} questions</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.floor(q.timeLimit / 60)}m
                </span>
              </div>
              {q.bestScore !== null && (
                <div className="mt-3 flex items-center gap-1 text-xs">
                  <Trophy className="w-3 h-3 text-warning" />
                  <span className="text-gray-500">
                    Best: {q.bestScore}% ({q.attempts} attempts)
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Results screen
  if (showResult) {
    const totalCorrect = quiz.questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);
    const scorePercent = Math.round(
      (totalCorrect / quiz.questions.length) * 100
    );
    const isPassing = scorePercent >= 70;

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
              isPassing ? "bg-success-light" : "bg-warning-light"
            }`}
          >
            <Trophy
              className={`w-10 h-10 ${
                isPassing ? "text-success" : "text-warning"
              }`}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isPassing ? "Great job! 🎉" : "Keep practicing! 💪"}
          </h2>
          <p className="text-gray-500 mb-8">
            You scored {scorePercent}% on {quiz.title}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{scorePercent}%</p>
              <p className="text-xs text-gray-500">Score</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-success">{totalCorrect}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-danger">
                {quiz.questions.length - totalCorrect}
              </p>
              <p className="text-xs text-gray-500">Wrong</p>
            </div>
          </div>

          {/* Question breakdown */}
          <div className="space-y-3 mb-8 text-left">
            {quiz.questions.map((q, i) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {q.question}
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-gray-500 mt-1">
                          Correct: {q.options[q.correctAnswer]}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => startQuiz(quiz)}
              className="btn btn-secondary"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={() => {
                setSelectedQuiz(null);
                setQuizStarted(false);
              }}
              className="btn btn-primary"
            >
              All Quizzes
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz in progress
  const question = quiz.questions[currentQ];
  const userAnswer = answers[question.id];
  const isAnswered = userAnswer !== undefined;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            setSelectedQuiz(null);
            setQuizStarted(false);
          }}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Exit
        </button>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
            timeRemaining < 30
              ? "bg-danger-light text-danger"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <Clock className="w-4 h-4" />
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{
              width: `${((currentQ + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-sm text-gray-500 font-medium shrink-0">
          {currentQ + 1}/{quiz.questions.length}
        </span>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Question {currentQ + 1}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, i) => {
                let optionStyle = "border-gray-200 hover:border-primary/30 hover:bg-primary-light/30";
                if (isAnswered) {
                  if (i === question.correctAnswer) {
                    optionStyle = "border-success bg-success-light/50";
                  } else if (i === userAnswer && i !== question.correctAnswer) {
                    optionStyle = "border-danger bg-danger-light/50";
                  } else {
                    optionStyle = "border-gray-100 opacity-50";
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(question.id, i)}
                    disabled={isAnswered}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${optionStyle}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium shrink-0 ${
                        isAnswered && i === question.correctAnswer
                          ? "bg-success text-white"
                          : isAnswered && i === userAnswer
                          ? "bg-danger text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm text-gray-700 flex-1">{option}</span>
                    {isAnswered && i === question.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-success shrink-0" />
                    )}
                    {isAnswered && i === userAnswer && i !== question.correctAnswer && (
                      <XCircle className="w-5 h-5 text-danger shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`card p-4 mb-6 ${
                  userAnswer === question.correctAnswer
                    ? "border-success/30 bg-success-light/20"
                    : "border-danger/30 bg-danger-light/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {userAnswer === question.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userAnswer === question.correctAnswer
                        ? "Correct!"
                        : "Incorrect"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <button onClick={handleNext} className="btn btn-primary">
                {currentQ < quiz.questions.length - 1 ? "Next Question" : "See Results"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
