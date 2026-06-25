"use client";

import { useEffect } from "react";

/** Header reativo ao scroll — portado de menu.js (Pedro). */
export default function HeaderScroll() {
  useEffect(() => {
    let lastY = window.scrollY || 0;
    let logoHiddenAfterScroll = false;

    const onScroll = () => {
      const y = window.scrollY || 0;
      document.body.classList.toggle("header-scrolled", y > 8);

      if (y > 8) logoHiddenAfterScroll = true;

      if (logoHiddenAfterScroll) {
        document.body.classList.add("header-hide-logo");
      } else {
        const scrollingDown = y > lastY + 2;
        if (scrollingDown) document.body.classList.add("header-hide-logo");
      }

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("header-scrolled", "header-hide-logo");
    };
  }, []);

  return null;
}
