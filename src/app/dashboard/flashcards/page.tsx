"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Layers,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { mockFlashcardDecks } from "@/lib/mock-data";
import { useFlashcardStore } from "@/lib/store";

export default function FlashcardsPage() {
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const {
    currentIndex,
    isFlipped,
    knownCards,
    flip,
    nextCard,
    prevCard,
    markKnown,
    markUnknown,
    reset,
  } = useFlashcardStore();

  const deck = mockFlashcardDecks.find((d) => d.id === selectedDeck);

  if (!deck) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Flashcards
          </h1>
          <p className="mt-1 text-gray-500">
            Study with AI-generated flashcard decks
          </p>
        </motion.div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFlashcardDecks.map((d, index) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onClick={() => {
                setSelectedDeck(d.id);
                reset();
              }}
              className="card card-interactive p-5 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center mb-3">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {d.title}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{d.courseName}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {d.cards.length} cards
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${d.mastery}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{d.mastery}%</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const card = deck.cards[currentIndex];
  const isKnown = knownCards.has(card.id);
  const totalKnown = deck.cards.filter((c) => knownCards.has(c.id)).length;
  const isComplete = currentIndex === deck.cards.length - 1 && isFlipped;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setSelectedDeck(null)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-center">
          <h2 className="text-sm font-semibold text-gray-900">{deck.title}</h2>
          <p className="text-xs text-gray-500">
            {currentIndex + 1} / {deck.cards.length}
          </p>
        </div>
        <button
          onClick={reset}
          className="btn btn-ghost text-sm"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{
            width: `${((currentIndex + 1) / deck.cards.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Flashcard */}
      <div
        className="perspective cursor-pointer mb-8"
        onClick={flip}
        style={{ minHeight: "280px" }}
      >
        <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
          {/* Front */}
          <div className="flip-card-front">
            <div className="w-full h-full card p-8 flex flex-col items-center justify-center text-center bg-white" style={{ minHeight: "280px" }}>
              <span className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                Question
              </span>
              <p className="text-lg sm:text-xl font-medium text-gray-900 leading-relaxed">
                {card.front}
              </p>
              <span className="text-xs text-gray-400 mt-6">
                Tap to reveal answer
              </span>
            </div>
          </div>

          {/* Back */}
          <div className="flip-card-back">
            <div className="w-full h-full card p-8 flex flex-col items-center justify-center text-center bg-primary-light border-primary/20" style={{ minHeight: "280px" }}>
              <span className="text-xs text-primary uppercase tracking-wider mb-4">
                Answer
              </span>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {card.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => {
            markUnknown(card.id);
            if (currentIndex < deck.cards.length - 1) nextCard(deck.cards.length);
          }}
          className="btn h-12 px-6 bg-danger-light text-danger border border-danger/20 hover:bg-danger hover:text-white transition-all"
        >
          <XCircle className="w-4 h-4" />
          Still Learning
        </button>
        <button
          onClick={() => {
            markKnown(card.id);
            if (currentIndex < deck.cards.length - 1) nextCard(deck.cards.length);
          }}
          className="btn h-12 px-6 bg-success-light text-success border border-success/20 hover:bg-success hover:text-white transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          Know It
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="btn btn-ghost disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <span className="text-sm text-gray-500">
          {totalKnown} / {deck.cards.length} known
        </span>
        <button
          onClick={() => nextCard(deck.cards.length)}
          disabled={currentIndex === deck.cards.length - 1}
          className="btn btn-ghost disabled:opacity-30"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Session Stats */}
      <div className="mt-8 card p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Session Stats
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-gray-50">
            <p className="text-lg font-bold text-gray-900">{deck.cards.length}</p>
            <p className="text-xs text-gray-500">Total Cards</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-success-light/50">
            <p className="text-lg font-bold text-success">{totalKnown}</p>
            <p className="text-xs text-gray-500">Known</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-danger-light/50">
            <p className="text-lg font-bold text-danger">
              {deck.cards.length - totalKnown}
            </p>
            <p className="text-xs text-gray-500">Learning</p>
          </div>
        </div>
      </div>
    </div>
  );
}
