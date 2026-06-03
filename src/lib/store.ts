"use client";

import { create } from "zustand";
import { mockUser, mockCourses, type User, type Course } from "./mock-data";

// ============================================================
// Auth Store
// ============================================================
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  hydrate: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (email: string) => {
    const user = { ...mockUser, email };
    if (typeof window !== "undefined") {
      localStorage.setItem("eduflow-auth", JSON.stringify({ isAuthenticated: true, user }));
    }
    set({ isAuthenticated: true, user });
  },
  register: (name: string, email: string) => {
    const user = { ...mockUser, name, email };
    if (typeof window !== "undefined") {
      localStorage.setItem("eduflow-auth", JSON.stringify({ isAuthenticated: true, user }));
    }
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("eduflow-auth");
    }
    set({ isAuthenticated: false, user: null });
  },
  hydrate: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("eduflow-auth");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          set({ isAuthenticated: parsed.isAuthenticated, user: parsed.user });
        } catch {
          // ignore
        }
      }
    }
  },
  updateUser: (data: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...data };
      if (typeof window !== "undefined") {
        localStorage.setItem("eduflow-auth", JSON.stringify({ isAuthenticated: state.isAuthenticated, user: newUser }));
      }
      return { user: newUser };
    });
  },
}));

// ============================================================
// App Store (Courses, Progress, etc.)
// ============================================================
interface AppState {
  courses: Course[];
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleLessonComplete: (courseId: string, lessonId: string) => void;
  updateCourseProgress: (courseId: string) => void;
  importCourse: (course: Course) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  courses: mockCourses,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleLessonComplete: (courseId: string, lessonId: string) => {
    set((state) => ({
      courses: state.courses.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          modules: course.modules.map((mod) => ({
            ...mod,
            lessons: mod.lessons.map((les) =>
              les.id === lessonId ? { ...les, completed: !les.completed } : les
            ),
          })),
        };
      }),
    }));
    get().updateCourseProgress(courseId);
  },
  updateCourseProgress: (courseId: string) => {
    set((state) => ({
      courses: state.courses.map((course) => {
        if (course.id !== courseId) return course;
        const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        const completedLessons = course.modules.reduce(
          (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
          0
        );
        return { ...course, progress: Math.round((completedLessons / totalLessons) * 100) };
      }),
    }));
  },
  importCourse: (course: Course) => {
    set((state) => ({ courses: [course, ...state.courses] }));
  },
}));

// ============================================================
// Quiz Store
// ============================================================
interface QuizState {
  currentQuestion: number;
  answers: Record<string, number>;
  score: number;
  isFinished: boolean;
  timeRemaining: number;
  setAnswer: (questionId: string, answer: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishQuiz: (totalQuestions: number) => void;
  resetQuiz: () => void;
  setTimeRemaining: (time: number) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuestion: 0,
  answers: {},
  score: 0,
  isFinished: false,
  timeRemaining: 0,
  setAnswer: (questionId, answer) =>
    set((s) => ({ answers: { ...s.answers, [questionId]: answer } })),
  nextQuestion: () => set((s) => ({ currentQuestion: s.currentQuestion + 1 })),
  prevQuestion: () => set((s) => ({ currentQuestion: Math.max(0, s.currentQuestion - 1) })),
  finishQuiz: (totalQuestions) =>
    set((s) => {
      let correct = 0;
      // Score calculation happens in the component with access to questions data
      return { isFinished: true, score: correct };
    }),
  resetQuiz: () =>
    set({ currentQuestion: 0, answers: {}, score: 0, isFinished: false, timeRemaining: 0 }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
}));

// ============================================================
// Flashcard Store
// ============================================================
interface FlashcardState {
  currentIndex: number;
  isFlipped: boolean;
  knownCards: Set<string>;
  flip: () => void;
  nextCard: (total: number) => void;
  prevCard: () => void;
  markKnown: (cardId: string) => void;
  markUnknown: (cardId: string) => void;
  reset: () => void;
}

export const useFlashcardStore = create<FlashcardState>((set) => ({
  currentIndex: 0,
  isFlipped: false,
  knownCards: new Set(),
  flip: () => set((s) => ({ isFlipped: !s.isFlipped })),
  nextCard: (total) =>
    set((s) => ({
      currentIndex: Math.min(s.currentIndex + 1, total - 1),
      isFlipped: false,
    })),
  prevCard: () =>
    set((s) => ({ currentIndex: Math.max(0, s.currentIndex - 1), isFlipped: false })),
  markKnown: (cardId) =>
    set((s) => {
      const newSet = new Set(s.knownCards);
      newSet.add(cardId);
      return { knownCards: newSet };
    }),
  markUnknown: (cardId) =>
    set((s) => {
      const newSet = new Set(s.knownCards);
      newSet.delete(cardId);
      return { knownCards: newSet };
    }),
  reset: () => set({ currentIndex: 0, isFlipped: false, knownCards: new Set() }),
}));
