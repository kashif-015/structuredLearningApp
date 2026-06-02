"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  BookOpen,
  CheckCircle,
  TrendingUp,
  Flame,
  Calendar,
  BarChart3,
  Trophy,
} from "lucide-react";
import { mockStreakData, mockWeeklyProgress, mockMonthlyProgress, mockCourses } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProgressPage() {
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const { user } = useAuthStore();

  const completedLessons = mockCourses.reduce(
    (acc, c) =>
      acc +
      c.modules.reduce(
        (a, m) => a + m.lessons.filter((l) => l.completed).length,
        0
      ),
    0
  );
  const totalLessons = mockCourses.reduce(
    (acc, c) => acc + c.modules.reduce((a, m) => a + m.lessons.length, 0),
    0
  );
  const avgCompletion = Math.round(
    mockCourses.reduce((a, c) => a + c.progress, 0) / mockCourses.length
  );

  // Streak calendar: 12 weeks (84 days)
  const weeks: { date: string; minutes: number }[][] = [];
  for (let i = 0; i < mockStreakData.length; i += 7) {
    weeks.push(mockStreakData.slice(i, i + 7));
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Progress
        </h1>
        <p className="mt-1 text-gray-500">
          Track your learning journey and achievements
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Total Hours",
            value: user?.totalHours || 147,
            icon: Clock,
            color: "#2563EB",
            bg: "#dbeafe",
            suffix: "h",
          },
          {
            label: "Lessons Done",
            value: completedLessons,
            icon: CheckCircle,
            color: "#10B981",
            bg: "#d1fae5",
            suffix: `/${totalLessons}`,
          },
          {
            label: "Avg. Completion",
            value: avgCompletion,
            icon: TrendingUp,
            color: "#8B5CF6",
            bg: "#ede9fe",
            suffix: "%",
          },
          {
            label: "Day Streak",
            value: user?.streak || 12,
            icon: Flame,
            color: "#EF4444",
            bg: "#fee2e2",
            suffix: " 🔥",
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: stat.bg }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stat.value}
              <span className="text-sm font-normal text-gray-400">
                {stat.suffix}
              </span>
            </p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Chart */}
          <motion.div variants={itemVariants} className="card p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Learning Activity
              </h2>
              <div className="flex rounded-xl bg-gray-100 p-1">
                {(["weekly", "monthly"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setChartView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      chartView === v
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    {v === "weekly" ? "Weekly" : "Monthly"}
                  </button>
                ))}
              </div>
            </div>

            {chartView === "weekly" ? (
              <div className="flex items-end justify-between gap-2 h-48">
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
                      <div
                        className="w-full max-w-[48px] bg-gray-100 rounded-lg overflow-hidden relative"
                        style={{ height: "140px" }}
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{
                            delay: 0.3,
                            duration: 0.6,
                            ease: "easeOut",
                          }}
                          className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-accent rounded-lg"
                        />
                      </div>
                      <span className="text-xs text-gray-400">{day.day}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-end justify-between gap-4 h-48">
                {mockMonthlyProgress.map((week) => {
                  const maxHours = Math.max(
                    ...mockMonthlyProgress.map((w) => w.hours)
                  );
                  const height = (week.hours / maxHours) * 100;
                  return (
                    <div
                      key={week.week}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <span className="text-xs font-medium text-gray-500">
                        {week.hours}h
                      </span>
                      <div
                        className="w-full max-w-[64px] bg-gray-100 rounded-lg overflow-hidden relative"
                        style={{ height: "140px" }}
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{
                            delay: 0.3,
                            duration: 0.6,
                            ease: "easeOut",
                          }}
                          className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-accent rounded-lg"
                        />
                      </div>
                      <span className="text-xs text-gray-400">{week.week}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Streak Calendar */}
          <motion.div variants={itemVariants} className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Learning Streak
            </h2>
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-1 min-w-[500px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((day) => {
                      let bg = "bg-gray-100";
                      if (day.minutes > 0 && day.minutes <= 20)
                        bg = "bg-primary/20";
                      else if (day.minutes > 20 && day.minutes <= 50)
                        bg = "bg-primary/40";
                      else if (day.minutes > 50 && day.minutes <= 90)
                        bg = "bg-primary/60";
                      else if (day.minutes > 90) bg = "bg-primary";

                      return (
                        <div
                          key={day.date}
                          className={`w-4 h-4 rounded-sm ${bg} transition-colors`}
                          title={`${day.date}: ${day.minutes}m`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-gray-100" />
              <div className="w-3 h-3 rounded-sm bg-primary/20" />
              <div className="w-3 h-3 rounded-sm bg-primary/40" />
              <div className="w-3 h-3 rounded-sm bg-primary/60" />
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span>More</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Course Breakdown */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Course Progress
            </h2>
            <div className="space-y-4">
              {mockCourses.map((course) => (
                <div key={course.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-gray-900 truncate pr-4">
                      {course.title}
                    </p>
                    <span className="text-xs font-medium text-gray-500 shrink-0">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        course.progress === 100
                          ? "bg-success"
                          : course.progress >= 50
                          ? "bg-primary"
                          : "bg-accent"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              Achievements
            </h2>
            <div className="space-y-3">
              {[
                {
                  label: "First Course Completed",
                  description: "Complete your first course",
                  earned: true,
                },
                {
                  label: "Week Warrior",
                  description: "7-day learning streak",
                  earned: true,
                },
                {
                  label: "Quiz Master",
                  description: "Score 100% on a quiz",
                  earned: true,
                },
                {
                  label: "Flashcard Scholar",
                  description: "Master 50 flashcards",
                  earned: false,
                },
                {
                  label: "Month Legend",
                  description: "30-day learning streak",
                  earned: false,
                },
              ].map((achievement) => (
                <div
                  key={achievement.label}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    achievement.earned ? "bg-warning-light/30" : "bg-gray-50 opacity-60"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      achievement.earned ? "bg-warning-light" : "bg-gray-200"
                    }`}
                  >
                    <Trophy
                      className={`w-4 h-4 ${
                        achievement.earned ? "text-warning" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {achievement.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
