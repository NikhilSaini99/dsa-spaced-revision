import { useState, useEffect, useCallback, useMemo } from "react";
import type { StreakData, ProblemProgress } from "../types";
import { today } from "../utils";

const STREAK_KEY = "dsa-streaks";

function calcStreak(dates: string[]): { currentStreak: number; longestStreak: number } {
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = [...new Set(dates)].sort().reverse(); // most recent first
  const todayStr = today();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  // Check if today or yesterday is in the list (streak is alive)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const streakAlive = sorted[0] === todayStr || sorted[0] === yesterdayStr;

  if (streakAlive) {
    currentStreak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1] + "T00:00:00");
      const curr = new Date(sorted[i] + "T00:00:00");
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  longestStreak = 1;
  const ascending = [...sorted].reverse();
  for (let i = 1; i < ascending.length; i++) {
    const prev = new Date(ascending[i - 1] + "T00:00:00");
    const curr = new Date(ascending[i] + "T00:00:00");
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { currentStreak, longestStreak };
}

export function useStreaks(progress: Record<number, ProblemProgress>) {
  const [streakData, setStreakData] = useState<StreakData>({
    dates: [],
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
  });

  // Load stored streak dates
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STREAK_KEY);
      if (stored) {
        const data = JSON.parse(stored) as StreakData;
        const { currentStreak, longestStreak } = calcStreak(data.dates);
        setStreakData({ ...data, currentStreak, longestStreak });
      }
    } catch { /* ignore */ }
  }, []);

  // Derive active dates from progress (solved dates + completed revision dates)
  const activeDates = useMemo(() => {
    const dates = new Set<string>();
    Object.values(progress).forEach((pg) => {
      if (pg.solvedDate) dates.add(pg.solvedDate);
      pg.revisions.forEach((r) => {
        if (r.done && r.completedDate) dates.add(r.completedDate);
      });
    });
    return Array.from(dates).sort();
  }, [progress]);

  // Record today's activity
  const recordActivity = useCallback((date?: string) => {
    const d = date || today();
    setStreakData((prev) => {
      const dates = prev.dates.includes(d) ? prev.dates : [...prev.dates, d];
      const { currentStreak, longestStreak } = calcStreak(dates);
      const next: StreakData = {
        dates,
        currentStreak,
        longestStreak,
        lastActiveDate: d,
      };
      try {
        localStorage.setItem(STREAK_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Merge progress-derived dates with stored dates
  useEffect(() => {
    if (activeDates.length === 0) return;
    setStreakData((prev) => {
      const merged = new Set([...prev.dates, ...activeDates]);
      const dates = Array.from(merged).sort();
      if (dates.length === prev.dates.length) return prev; // no change
      const { currentStreak, longestStreak } = calcStreak(dates);
      const next: StreakData = {
        dates,
        currentStreak,
        longestStreak,
        lastActiveDate: dates[dates.length - 1] || "",
      };
      try {
        localStorage.setItem(STREAK_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, [activeDates]);

  const todayActive = streakData.dates.includes(today());

  return { streakData, recordActivity, todayActive, activeDates };
}
