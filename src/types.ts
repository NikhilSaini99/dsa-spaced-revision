export interface Problem {
  id: number;
  name: string;
  pattern: string;
  difficulty: string;
  url: string;
}

export interface Revision {
  date: string;
  done: boolean;
}

export type SolveRating = "easy" | "got-it" | "struggled" | "redo";

export interface ProblemProgress {
  solvedDate: string;
  revisions: Revision[];
  rating?: SolveRating;
}

export type TabKey = "problems" | "random" | "today" | "upcoming";
export type ScopeFilter = "all" | "solved" | "unsolved";
export type SortKey = "id" | "name" | "difficulty" | "pattern" | "status";
export type SortDir = "asc" | "desc";

export interface ExportData {
  version: 1;
  exportedAt: string;
  progress: Record<number, ProblemProgress>;
  notes: Record<number, string>;
}
