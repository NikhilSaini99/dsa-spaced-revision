export type SourceKey = "LeetCode" | "GFG" | "HackerRank" | "TUF";

export interface Problem {
  id: number;
  name: string;
  pattern: string;
  difficulty: string;
  url: string;
  source: SourceKey;
  builtIn: boolean;
  topics: string[];
  companies?: string[];
}

export interface Revision {
  date: string;
  done: boolean;
  completedDate?: string; // NEW: track when revision was completed (for heatmap)
}

export type SolveRating = "easy" | "got-it" | "struggled" | "redo";

export interface ProblemProgress {
  solvedDate: string;
  revisions: Revision[];
  rating?: SolveRating;
}

export type TabKey = "problems" | "random" | "today" | "upcoming" | "stats";
export type ScopeFilter = "all" | "solved" | "unsolved";
export type SortKey = "id" | "name" | "difficulty" | "pattern" | "status";
export type SortDir = "asc" | "desc";

/** Shape of a problem incoming from the browser extension */
export interface IncomingProblem {
  name: string;
  url: string;
  source: SourceKey;
  difficulty: string;
  topics?: string[];
  companies?: string[];
  savedAt: string;
}

export interface ExportData {
  version: 1 | 2;
  exportedAt: string;
  progress: Record<number, ProblemProgress>;
  notes: Record<number, string>;
  customProblems?: Problem[];
  settings?: UserSettings;
}

/** Toast notification types */
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

/** User settings for customizable spaced repetition */
export interface UserSettings {
  spacedDays: number[];
  spacedPreset: "aggressive" | "default" | "relaxed" | "custom";
  notificationsEnabled: boolean;
  notificationTime: string; // HH:MM format
  theme: "dark" | "light" | "system";
}

/** Streak tracking data */
export interface StreakData {
  dates: string[]; // ISO date strings of active days
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

/** Onboarding state */
export interface OnboardingState {
  completed: boolean;
  step: number;
}
