"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Clock,
  PlayCircle,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { categories } from "@/lib/mock-data";
import { formatDuration } from "@/lib/utils";

export default function CoursesPage() {
  const { courses } = useAppStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "All" || c.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Courses
            </h1>
            <p className="mt-1 text-gray-500">
              {courses.length} courses enrolled
            </p>
          </div>
          <Link href="/dashboard/import" className="btn btn-primary">
            <BookOpen className="w-4 h-4" />
            Import Playlist
          </Link>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-6 space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <Link
              href={`/dashboard/course/${course.id}`}
              className="card card-interactive block overflow-hidden group"
            >
              <div className="h-36 bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center relative">
                <BookOpen className="w-10 h-10 text-primary/20" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-xs font-medium text-gray-600 backdrop-blur-sm">
                  {course.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{course.author}</p>

                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(course.totalDuration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <PlayCircle className="w-3.5 h-3.5" />
                    {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                  </span>
                  <span>⭐ {course.rating}</span>
                </div>

                <div className="flex items-center gap-3">
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
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 text-sm mb-4">
            Try adjusting your search or filter
          </p>
          <Link href="/dashboard/import" className="btn btn-primary">
            Import Your First Playlist
          </Link>
        </div>
      )}
    </div>
  );
}
