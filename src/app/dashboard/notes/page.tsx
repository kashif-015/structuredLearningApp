"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Pin,
  FileText,
  Clock,
  Folder,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { mockNotes } from "@/lib/mock-data";

const folders = ["All", "Web Development", "Machine Learning", "Design", "System Design"];

export default function NotesPage() {
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("All");
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const filtered = mockNotes.filter((note) => {
    const matchSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchFolder =
      activeFolder === "All" || note.folder === activeFolder;
    return matchSearch && matchFolder;
  });

  const pinnedNotes = filtered.filter((n) => n.pinned);
  const unpinnedNotes = filtered.filter((n) => !n.pinned);
  const activeNote = mockNotes.find((n) => n.id === selectedNote);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Notes
        </h1>
        <p className="mt-1 text-gray-500">
          AI-generated notes from your courses
        </p>
      </motion.div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-72 shrink-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Folders */}
          <div className="card p-3 mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
              Folders
            </h3>
            <div className="space-y-0.5">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeFolder === folder
                      ? "bg-primary-light text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Folder className="w-4 h-4 shrink-0" />
                  <span className="truncate">{folder}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {folder === "All"
                      ? mockNotes.length
                      : mockNotes.filter((n) => n.folder === folder).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes List + Detail */}
        <div className="flex-1 min-w-0">
          {!activeNote ? (
            <>
              {/* Pinned */}
              {pinnedNotes.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <Pin className="w-4 h-4 text-primary" />
                    Pinned Notes
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {pinnedNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => setSelectedNote(note.id)}
                        className="card card-interactive p-4 text-left"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {note.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {note.courseName}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {note.content.replace(/[#*`\n]/g, " ").slice(0, 100)}...
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* All Notes */}
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                All Notes ({unpinnedNotes.length})
              </h2>
              <div className="space-y-3">
                {unpinnedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNote(note.id)}
                    className="card card-interactive p-4 w-full text-left flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {note.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {note.courseName}
                      </p>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {note.updatedAt}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                  </button>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notes found
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Start learning courses to generate AI notes
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Note Detail View */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelectedNote(null)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
              >
                ← Back to notes
              </button>
              <div className="card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-primary-light text-primary text-xs font-medium">
                    {activeNote!.courseName}
                  </span>
                  {activeNote!.pinned && (
                    <Pin className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeNote!.title}
                </h2>
                <p className="text-xs text-gray-400 mb-6">
                  Updated {activeNote!.updatedAt}
                </p>
                <div className="prose prose-sm max-w-none">
                  {activeNote!.content.split("\n").map((line, i) => {
                    if (line.startsWith("## "))
                      return (
                        <h3
                          key={i}
                          className="text-lg font-semibold text-gray-900 mt-6 mb-3"
                        >
                          {line.replace("## ", "")}
                        </h3>
                      );
                    if (line.startsWith("### "))
                      return (
                        <h4
                          key={i}
                          className="text-base font-semibold text-gray-900 mt-4 mb-2"
                        >
                          {line.replace("### ", "")}
                        </h4>
                      );
                    if (line.startsWith("- "))
                      return (
                        <li
                          key={i}
                          className="text-sm text-gray-600 ml-4 list-disc mb-1"
                        >
                          {line
                            .replace("- ", "")
                            .replace(/\*\*(.*?)\*\*/g, "$1")}
                        </li>
                      );
                    if (line.startsWith("```"))
                      return null; // Skip code fences in simple render
                    if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4."))
                      return (
                        <li
                          key={i}
                          className="text-sm text-gray-600 ml-4 list-decimal mb-1"
                        >
                          {line.replace(/^\d+\.\s*/, "")}
                        </li>
                      );
                    if (line.trim() === "") return <div key={i} className="h-2" />;
                    return (
                      <p key={i} className="text-sm text-gray-600 mb-1 font-mono">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
