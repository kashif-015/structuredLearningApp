"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("splash_shown");
    
    // For PWA experience, we want the splash screen to show on app launch.
    // If it's a standalone PWA, we might want to show it more reliably, but 
    // sessionStorage ensures it shows once per tab session.
    if (hasShown) {
      setShow(false);
    } else {
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("splash_shown", "true");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-50 overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex items-center justify-center w-24 h-24 mb-6"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-primary/30 rounded-full" 
            />
            <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-blue-700 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white/10" />
              <BookOpen className="w-10 h-10 text-white relative z-10" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 tracking-tight"
          >
            EduFlow
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-3 text-xs font-semibold tracking-widest text-primary uppercase"
          >
            Learning Reimagined
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
