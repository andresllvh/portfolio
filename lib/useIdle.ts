"use client";

import { useEffect, useState } from "react";

// Becomes true once the browser has a quiet moment after the first paint (or
// after `timeout` ms at the latest). Used to start heavy work, like the 3D
// scene, without competing with the hero text for the main thread.
export function useIdle(timeout = 1500): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), timeout);
    return () => clearTimeout(id);
  }, [timeout]);

  return idle;
}
