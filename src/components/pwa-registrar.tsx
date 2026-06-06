"use client";

import { useEffect } from "react";

export default function PwaRegistrar() {
  useEffect(() => {
    // Register service worker only in production to avoid interfering with dev fast refresh
    if (process.env.NODE_ENV === "production" && typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }, []);

  return null;
}
