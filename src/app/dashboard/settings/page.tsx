"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { getInitials } from "@/lib/utils";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="mt-1 text-gray-500">Manage your account and preferences</p>
      </motion.div>

      <div className="mt-8 space-y-6">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary font-bold text-xl">
              {getInitials(user?.name || "Alex Johnson")}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {user?.name || "Alex Johnson"}
              </p>
              <p className="text-sm text-gray-500">
                {user?.email || "alex@example.com"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Joined {user?.joinedDate || "Sep 2025"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Display Name
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.name || "Alex Johnson"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "alex@example.com"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Preferences
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Notifications
                  </p>
                  <p className="text-xs text-gray-500">
                    Learning reminders and updates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  notifications ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                    notifications ? "left-5" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Dark Mode
                  </p>
                  <p className="text-xs text-gray-500">Coming soon</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Soon
              </span>
            </div>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Support</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  Help Center
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  Privacy Policy
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  Terms of Service
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-danger/20 text-danger hover:bg-danger-light transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>

        <p className="text-center text-xs text-gray-400 pb-8">
          EduFlow v1.0.0 • Made with ❤️
        </p>
      </div>
    </div>
  );
}
