"use client";

import { useEffect, useState } from "react";

const WK_DATE = new Date("2027-10-15");

export function Countdown() {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const target = Math.ceil((WK_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const duration = 1500;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 ml-4 inline-flex h-fit gap-1 items-center">
      <strong className="text-sm tabular-nums">{displayed}</strong> dagen tot het WK
    </span>
  );
}