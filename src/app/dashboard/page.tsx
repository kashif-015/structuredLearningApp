"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Clock,
  Flame,
  BookOpen,
  TrendingUp,
  ArrowRight,
  PlayCircle,
  CheckCircle,
  Trophy,
  Layers,
  BarChart3,
} from "lucide-react";
import { useAuthStore, useAppStore } from "@/lib/store";
import { mockActivity, mockWeeklyProgress, recommendedCourses } from "@/lib/mock-data";
import { getGreeting, formatDuration } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const activityIcons: Record<string, React.ElementType> = {
  "check-circle": CheckCircle,
  "flame": Flame,
  "trophy": Trophy,
  "layers": Layers,
  "play-circle": PlayCircle,
};

export default function DashboardHome() {
  const { user } = useAuthStore();
  const { courses } = useAppStore();
  const displayName = user?.name?.split(" ")[0] || "Learner";

  const totalMinutesThisWeek = mockWeeklyProgress.reduce((a, b) => a + b.minutes, 0);
  const continueLearning = courses
    .filter((c) => c.progress > 0 && c.progress < 100)
    .sort((a, b) => b.lastAccessed.localeCompare(a.lastAccessed))
    .slice(0, 3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
    >
      {/* Welcome */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {getGreeting()}, {displayName} 👋
        </h1>
        <p className="mt-1 text-gray-500">
          Ready to continue your learning journey?
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            label: "Learning Hours",
            value: user?.totalHours || 147,
            icon: Clock,
            color: "#2563EB",
            bg: "#dbeafe",
          },
          {
            label: "Day Streak",
            value: user?.streak || 12,
            icon: Flame,
            color: "#EF4444",
            bg: "#fee2e2",
            suffix: "🔥",
          },
          {
            label: "Courses Completed",
            value: user?.coursesCompleted || 8,
            icon: BookOpen,
            color: "#10B981",
            bg: "#d1fae5",
          },
          {
            label: "This Week",
            value: formatDuration(totalMinutesThisWeek),
            icon: TrendingUp,
            color: "#8B5CF6",
            bg: "#ede9fe",
            isString: true,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg }}
              >
                <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stat.isString ? stat.value : stat.value}
              {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Continue Learning + Recent */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning */}
          {continueLearning.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
                <Link
                  href="/dashboard/courses"
                  className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {continueLearning.map((course) => {
                  const currentLesson = course.modules
                    .flatMap((m) => m.lessons)
                    .find((l) => !l.completed);

                  return (
                    <Link
                      key={course.id}
                      href={`/dashboard/course/${course.id}`}
                      className="card card-interactive flex items-center gap-4 p-4 group"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0">
                        <PlayCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {course.title}
                        </p>
                        {currentLesson && (
                          <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                            Next: {currentLesson.title}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-500">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0 hidden sm:block" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Recommended */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recommended for You
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCourses.map((course) => (
                <div
                  key={course.id}
                  className="card card-interactive p-4"
                >
                  <div className="w-full h-28 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-3">
                    <BookOpen className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                    {course.title}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">{course.author}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{course.duration}</span>
                    <span className="flex items-center gap-1">
                      ⭐ {course.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Progress Chart */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Weekly Activity
            </h2>
            <div className="card p-5">
              <div className="flex items-end justify-between gap-2 h-40">
                {mockWeeklyProgress.map((day) => {
                  const maxMinutes = Math.max(
                    ...mockWeeklyProgress.map((d) => d.minutes)
                  );
                  const height = (day.minutes / maxMinutes) * 100;
                  return (
                    <div
                      key={day.day}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <span className="text-xs font-medium text-gray-500">
                        {day.minutes}m
                      </span>
                      <div className="w-full max-w-[40px] bg-gray-100 rounded-lg overflow-hidden relative" style={{ height: "100px" }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                          className="absolute bottom-0 w-full bg-primary rounded-lg"
                        />
                      </div>
                      <span className="text-xs text-gray-400">{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Activity Feed */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <div className="space-y-3">
            {mockActivity.slice(0, 5).map((activity) => {
              const Icon = activityIcons[activity.icon] || CheckCircle;
              return (
                <div key={activity.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {activity.description}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/import"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-gray-700">Import a playlist</span>
              </Link>
              <Link
                href="/dashboard/flashcards"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-warning-light flex items-center justify-center">
                  <Layers className="w-4 h-4 text-warning" />
                </div>
                <span className="text-sm text-gray-700">Study flashcards</span>
              </Link>
              <Link
                href="/dashboard/quiz"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-success-light flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm text-gray-700">Take a quiz</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
