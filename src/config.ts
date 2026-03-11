import type { Problem, SolveRating, SourceKey } from "./types";

export const BUILTIN_PROBLEMS: Problem[] = [
  // Two Pointers
  { id: 1, name: "Valid Palindrome", pattern: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome/", source: "LeetCode", builtIn: true, topics: ["String"] },
  { id: 2, name: "Two Sum II - Input Array Is Sorted", pattern: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 3, name: "Move Zeroes", pattern: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/move-zeroes/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 4, name: "Remove Duplicates from Sorted Array", pattern: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 5, name: "3Sum", pattern: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/", source: "LeetCode", builtIn: true, topics: ["Array", "Sorting"] },
  { id: 6, name: "Container With Most Water", pattern: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/", source: "LeetCode", builtIn: true, topics: ["Array", "Greedy"] },
  { id: 7, name: "Sort Colors", pattern: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/sort-colors/", source: "LeetCode", builtIn: true, topics: ["Array", "Sorting"] },
  { id: 8, name: "4Sum", pattern: "Two Pointers", difficulty: "Hard", url: "https://leetcode.com/problems/4sum/", source: "LeetCode", builtIn: true, topics: ["Array", "Sorting"] },
  { id: 9, name: "Trapping Rain Water", pattern: "Two Pointers", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/", source: "LeetCode", builtIn: true, topics: ["Array", "Stack"] },

  // Fast & Slow Pointers
  { id: 10, name: "Linked List Cycle", pattern: "Fast & Slow Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/linked-list-cycle/", source: "LeetCode", builtIn: true, topics: ["Linked List"] },
  { id: 11, name: "Middle of the Linked List", pattern: "Fast & Slow Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/middle-of-the-linked-list/", source: "LeetCode", builtIn: true, topics: ["Linked List"] },
  { id: 12, name: "Happy Number", pattern: "Fast & Slow Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/happy-number/", source: "LeetCode", builtIn: true, topics: ["Math", "Hash Table"] },
  { id: 13, name: "Linked List Cycle II", pattern: "Fast & Slow Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/linked-list-cycle-ii/", source: "LeetCode", builtIn: true, topics: ["Linked List"] },
  { id: 14, name: "Find the Duplicate Number", pattern: "Fast & Slow Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/find-the-duplicate-number/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 15, name: "Reorder List", pattern: "Fast & Slow Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/reorder-list/", source: "LeetCode", builtIn: true, topics: ["Linked List"] },
  { id: 16, name: "Palindrome Linked List", pattern: "Fast & Slow Pointers", difficulty: "Hard", url: "https://leetcode.com/problems/palindrome-linked-list/", source: "LeetCode", builtIn: true, topics: ["Linked List", "Stack"] },

  // Linked List
  { id: 17, name: "Reverse Linked List", pattern: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/", source: "LeetCode", builtIn: true, topics: ["Linked List", "Recursion"] },
  { id: 18, name: "Merge Two Sorted Lists", pattern: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/", source: "LeetCode", builtIn: true, topics: ["Linked List", "Recursion"] },
  { id: 19, name: "Remove Nth Node From End of List", pattern: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", source: "LeetCode", builtIn: true, topics: ["Linked List"] },
  { id: 20, name: "Intersection of Two Linked Lists", pattern: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/intersection-of-two-linked-lists/", source: "LeetCode", builtIn: true, topics: ["Linked List", "Hash Table"] },
  { id: 21, name: "Rotate List", pattern: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/rotate-list/", source: "LeetCode", builtIn: true, topics: ["Linked List"] },
  { id: 22, name: "Merge k Sorted Lists", pattern: "Linked List", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/", source: "LeetCode", builtIn: true, topics: ["Linked List", "Heap"] },
  { id: 23, name: "LRU Cache", pattern: "Linked List", difficulty: "Hard", url: "https://leetcode.com/problems/lru-cache/", source: "LeetCode", builtIn: true, topics: ["Linked List", "Hash Table", "Design"] },

  // Sliding Window
  { id: 24, name: "Maximum Average Subarray I", pattern: "Sliding Window", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-average-subarray-i/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 25, name: "Contains Duplicate II", pattern: "Sliding Window", difficulty: "Easy", url: "https://leetcode.com/problems/contains-duplicate-ii/", source: "LeetCode", builtIn: true, topics: ["Array", "Hash Table"] },
  { id: 26, name: "Longest Substring Without Repeating Characters", pattern: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", source: "LeetCode", builtIn: true, topics: ["String", "Hash Table"] },
  { id: 27, name: "Permutation in String", pattern: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/permutation-in-string/", source: "LeetCode", builtIn: true, topics: ["String", "Hash Table"] },
  { id: 28, name: "Max Consecutive Ones III", pattern: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/max-consecutive-ones-iii/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 29, name: "Longest Repeating Character Replacement", pattern: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", source: "LeetCode", builtIn: true, topics: ["String", "Hash Table"] },
  { id: 30, name: "Fruit Into Baskets", pattern: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/fruit-into-baskets/", source: "LeetCode", builtIn: true, topics: ["Array", "Hash Table"] },
  { id: 31, name: "Minimum Window Substring", pattern: "Sliding Window", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-window-substring/", source: "LeetCode", builtIn: true, topics: ["String", "Hash Table"] },
  { id: 32, name: "Sliding Window Maximum", pattern: "Sliding Window", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-maximum/", source: "LeetCode", builtIn: true, topics: ["Array", "Deque"] },

  // Prefix Sum
  { id: 33, name: "Running Sum of 1d Array", pattern: "Prefix Sum", difficulty: "Easy", url: "https://leetcode.com/problems/running-sum-of-1d-array/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 34, name: "Find Pivot Index", pattern: "Prefix Sum", difficulty: "Easy", url: "https://leetcode.com/problems/find-pivot-index/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 35, name: "Range Sum Query - Immutable", pattern: "Prefix Sum", difficulty: "Easy", url: "https://leetcode.com/problems/range-sum-query-immutable/", source: "LeetCode", builtIn: true, topics: ["Array", "Design"] },
  { id: 36, name: "Subarray Sum Equals K", pattern: "Prefix Sum", difficulty: "Medium", url: "https://leetcode.com/problems/subarray-sum-equals-k/", source: "LeetCode", builtIn: true, topics: ["Array", "Hash Table"] },
  { id: 37, name: "Product of Array Except Self", pattern: "Prefix Sum", difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 38, name: "Continuous Subarray Sum", pattern: "Prefix Sum", difficulty: "Medium", url: "https://leetcode.com/problems/continuous-subarray-sum/", source: "LeetCode", builtIn: true, topics: ["Array", "Math", "Hash Table"] },
  { id: 39, name: "Range Sum Query 2D - Immutable", pattern: "Prefix Sum", difficulty: "Medium", url: "https://leetcode.com/problems/range-sum-query-2d-immutable/", source: "LeetCode", builtIn: true, topics: ["Array", "Matrix", "Design"] },
  { id: 40, name: "Count Number of Nice Subarrays", pattern: "Prefix Sum", difficulty: "Medium", url: "https://leetcode.com/problems/count-number-of-nice-subarrays/", source: "LeetCode", builtIn: true, topics: ["Array", "Math"] },

  // Binary Search
  { id: 41, name: "Binary Search", pattern: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/binary-search/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 42, name: "Search Insert Position", pattern: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/search-insert-position/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 43, name: "First Bad Version", pattern: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/first-bad-version/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 44, name: "Find First and Last Position", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 45, name: "Search in Rotated Sorted Array", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 46, name: "Find Minimum in Rotated Sorted Array", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 47, name: "Koko Eating Bananas", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/koko-eating-bananas/", source: "LeetCode", builtIn: true, topics: ["Array", "Math"] },
  { id: 48, name: "Search a 2D Matrix", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/search-a-2d-matrix/", source: "LeetCode", builtIn: true, topics: ["Array", "Matrix"] },
  { id: 49, name: "Find Peak Element", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/find-peak-element/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 50, name: "Capacity To Ship Packages Within D Days", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/", source: "LeetCode", builtIn: true, topics: ["Array", "Greedy"] },
  { id: 51, name: "Aggressive Cows", pattern: "Binary Search", difficulty: "Hard", url: "https://leetcode.com/discuss/post/1302335/aggressive-cows-spoj-fully-explained-c-b-xvvg/", source: "LeetCode", builtIn: true, topics: ["Array", "Greedy"] },
  { id: 52, name: "Minimum Number of Days to Make m Bouquets", pattern: "Binary Search", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/", source: "LeetCode", builtIn: true, topics: ["Array"] },
  { id: 53, name: "Split Array Largest Sum", pattern: "Binary Search", difficulty: "Hard", url: "https://leetcode.com/problems/split-array-largest-sum/", source: "LeetCode", builtIn: true, topics: ["Array", "Dynamic Programming", "Greedy"] },
  { id: 54, name: "Median of Two Sorted Arrays", pattern: "Binary Search", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", source: "LeetCode", builtIn: true, topics: ["Array"] },
];

/** @deprecated Use allProblems from useProblems hook instead */
export const PROBLEMS = BUILTIN_PROBLEMS;

/** Spaced repetition intervals (days after solving) */
export const SPACED_DAYS = [3, 7, 14, 30];

/** Old intervals for migration detection */
export const OLD_SPACED_DAYS = [3, 5, 9, 15];

/** localStorage key for tracking data schema version */
export const SCHEMA_VERSION_KEY = "dsa-schema-version";
export const CURRENT_SCHEMA_VERSION = 3;

export const BUILTIN_PATTERNS = ["Two Pointers", "Fast & Slow Pointers", "Linked List", "Sliding Window", "Prefix Sum", "Binary Search"];
export const PATTERNS = ["All", ...BUILTIN_PATTERNS];
export const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

export const SOURCES: SourceKey[] = ["LeetCode", "GFG", "HackerRank", "TUF"];
export const SOURCE_COLORS: Record<string, string> = {
  LeetCode: "#f89f1b",
  GFG: "#2f8d46",
  HackerRank: "#1ba94c",
  TUF: "#e74c3c",
};

/** Custom problem IDs start at this value to avoid collision with built-in IDs (1-9999) */
export const CUSTOM_ID_START = 10001;
export const CUSTOM_PROBLEMS_STORAGE_KEY = "dsa-custom-problems";

export const DIFF_COLOR: Record<string, string> = { Easy: "#4ade80", Medium: "#facc15", Hard: "#f87171" };
export const DIFF_BG: Record<string, string> = { Easy: "#14532d33", Medium: "#71350033", Hard: "#7f1d1d33" };
export const PATTERN_COLORS: Record<string, string> = {
  "Two Pointers": "#818cf8",
  "Fast & Slow Pointers": "#34d399",
  "Linked List": "#fb923c",
  "Sliding Window": "#f472b6",
  "Prefix Sum": "#60a5fa",
  "Binary Search": "#a78bfa",
};

export const BUILTIN_TOPICS = [
  "Array", "String", "Linked List", "Hash Table", "Math",
  "Sorting", "Stack", "Heap", "Matrix", "Greedy",
  "Recursion", "Design", "Deque", "Dynamic Programming",
] as const;

export const TOPIC_COLORS: Record<string, string> = {
  "Array": "#3b82f6",
  "String": "#8b5cf6",
  "Linked List": "#f97316",
  "Hash Table": "#14b8a6",
  "Math": "#ec4899",
  "Sorting": "#eab308",
  "Stack": "#ef4444",
  "Heap": "#06b6d4",
  "Matrix": "#84cc16",
  "Greedy": "#f59e0b",
  "Recursion": "#a855f7",
  "Design": "#6366f1",
  "Deque": "#0ea5e9",
  "Dynamic Programming": "#d946ef",
};

export const RATING_OPTIONS: {
  key: SolveRating;
  label: string;
  emoji: string;
  color: string;
  description: string;
}[] = [
  { key: "easy", label: "Easy", emoji: "😎", color: "#4ade80", description: "Solved quickly, understood well" },
  { key: "got-it", label: "Got It", emoji: "👍", color: "#60a5fa", description: "Needed some thought, but solved" },
  { key: "struggled", label: "Struggled", emoji: "😤", color: "#facc15", description: "Took a while, need more practice" },
  { key: "redo", label: "Need Redo", emoji: "🔄", color: "#f87171", description: "Couldn't solve, need to revisit" },
];

export const NOTES_TEMPLATES = [
  { label: "Approach", text: "## Approach\n\n- \n\n## Key Insight\n\n- \n" },
  { label: "Edge Cases", text: "## Edge Cases\n\n- Empty input\n- Single element\n- All same elements\n- Negative numbers\n- \n" },
  { label: "Complexity", text: "## Time Complexity\n\n- O()\n\n## Space Complexity\n\n- O()\n" },
  { label: "Mistakes", text: "## Mistakes to Avoid\n\n- \n\n## What I Learned\n\n- \n" },
];

export const PROGRESS_STORAGE_KEY = "dsa-progress";
export const NOTES_STORAGE_KEY = "dsa-notes";

export const TAB_KEYS = ["problems", "random", "today", "upcoming"] as const;
