import type { Problem, SolveRating } from "./types";

export const PROBLEMS: Problem[] = [
  // Two Pointers
  { id: 1, name: "Valid Palindrome", pattern: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome/" },
  { id: 2, name: "Two Sum II - Input Array Is Sorted", pattern: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
  { id: 3, name: "Move Zeroes", pattern: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/move-zeroes/" },
  { id: 4, name: "Remove Duplicates from Sorted Array", pattern: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
  { id: 5, name: "3Sum", pattern: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" },
  { id: 6, name: "Container With Most Water", pattern: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
  { id: 7, name: "Sort Colors", pattern: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/sort-colors/" },
  { id: 8, name: "4Sum", pattern: "Two Pointers", difficulty: "Hard", url: "https://leetcode.com/problems/4sum/" },
  { id: 9, name: "Trapping Rain Water", pattern: "Two Pointers", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/" },

  // Fast & Slow Pointers
  { id: 10, name: "Linked List Cycle", pattern: "Fast & Slow Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/linked-list-cycle/" },
  { id: 11, name: "Middle of the Linked List", pattern: "Fast & Slow Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/middle-of-the-linked-list/" },
  { id: 12, name: "Happy Number", pattern: "Fast & Slow Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/happy-number/" },
  { id: 13, name: "Linked List Cycle II", pattern: "Fast & Slow Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/linked-list-cycle-ii/" },
  { id: 14, name: "Find the Duplicate Number", pattern: "Fast & Slow Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/find-the-duplicate-number/" },
  { id: 15, name: "Reorder List", pattern: "Fast & Slow Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/reorder-list/" },
  { id: 16, name: "Palindrome Linked List", pattern: "Fast & Slow Pointers", difficulty: "Hard", url: "https://leetcode.com/problems/palindrome-linked-list/" },

  // Linked List
  { id: 17, name: "Reverse Linked List", pattern: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: 18, name: "Merge Two Sorted Lists", pattern: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: 19, name: "Remove Nth Node From End of List", pattern: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { id: 20, name: "Intersection of Two Linked Lists", pattern: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
  { id: 21, name: "Rotate List", pattern: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/rotate-list/" },
  { id: 22, name: "Merge k Sorted Lists", pattern: "Linked List", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
  { id: 23, name: "LRU Cache", pattern: "Linked List", difficulty: "Hard", url: "https://leetcode.com/problems/lru-cache/" },

  // Sliding Window
  { id: 24, name: "Maximum Average Subarray I", pattern: "Sliding Window", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-average-subarray-i/" },
  { id: 25, name: "Contains Duplicate II", pattern: "Sliding Window", difficulty: "Easy", url: "https://leetcode.com/problems/contains-duplicate-ii/" },
  { id: 26, name: "Longest Substring Without Repeating Characters", pattern: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: 27, name: "Permutation in String", pattern: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/permutation-in-string/" },
  { id: 28, name: "Max Consecutive Ones III", pattern: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/max-consecutive-ones-iii/" },
  { id: 29, name: "Longest Repeating Character Replacement", pattern: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
  { id: 30, name: "Fruit Into Baskets", pattern: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/fruit-into-baskets/" },
  { id: 31, name: "Minimum Window Substring", pattern: "Sliding Window", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-window-substring/" },
  { id: 32, name: "Sliding Window Maximum", pattern: "Sliding Window", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-maximum/" },

  // Prefix Sum
  { id: 33, name: "Running Sum of 1d Array", pattern: "Prefix Sum", difficulty: "Easy", url: "https://leetcode.com/problems/running-sum-of-1d-array/" },
  { id: 34, name: "Find Pivot Index", pattern: "Prefix Sum", difficulty: "Easy", url: "https://leetcode.com/problems/find-pivot-index/" },
  { id: 35, name: "Range Sum Query - Immutable", pattern: "Prefix Sum", difficulty: "Easy", url: "https://leetcode.com/problems/range-sum-query-immutable/" },
  { id: 36, name: "Subarray Sum Equals K", pattern: "Prefix Sum", difficulty: "Medium", url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
  { id: 37, name: "Product of Array Except Self", pattern: "Prefix Sum", difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
  { id: 38, name: "Continuous Subarray Sum", pattern: "Prefix Sum", difficulty: "Medium", url: "https://leetcode.com/problems/continuous-subarray-sum/" },
  { id: 39, name: "Range Sum Query 2D - Immutable", pattern: "Prefix Sum", difficulty: "Medium", url: "https://leetcode.com/problems/range-sum-query-2d-immutable/" },
  { id: 40, name: "Count Number of Nice Subarrays", pattern: "Prefix Sum", difficulty: "Medium", url: "https://leetcode.com/problems/count-number-of-nice-subarrays/" },

  // Binary Search
  { id: 41, name: "Binary Search", pattern: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/binary-search/" },
  { id: 42, name: "Search Insert Position", pattern: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/search-insert-position/" },
  { id: 43, name: "First Bad Version", pattern: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/first-bad-version/" },
  { id: 44, name: "Find First and Last Position", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" },
  { id: 45, name: "Search in Rotated Sorted Array", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: 46, name: "Find Minimum in Rotated Sorted Array", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id: 47, name: "Koko Eating Bananas", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/koko-eating-bananas/" },
  { id: 48, name: "Search a 2D Matrix", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/search-a-2d-matrix/" },
  { id: 49, name: "Find Peak Element", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/find-peak-element/" },
  { id: 50, name: "Capacity To Ship Packages Within D Days", pattern: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/" },
  { id: 51, name: "Aggressive Cows", pattern: "Binary Search", difficulty: "Hard", url: "https://leetcode.com/discuss/post/1302335/aggressive-cows-spoj-fully-explained-c-b-xvvg/" },
  { id: 52, name: "Minimum Number of Days to Make m Bouquets", pattern: "Binary Search", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/" },
  { id: 53, name: "Split Array Largest Sum", pattern: "Binary Search", difficulty: "Hard", url: "https://leetcode.com/problems/split-array-largest-sum/" },
  { id: 54, name: "Median of Two Sorted Arrays", pattern: "Binary Search", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
];

/** Spaced repetition intervals (days after solving) */
export const SPACED_DAYS = [3, 5, 9, 15];

export const PATTERNS = ["All", "Two Pointers", "Fast & Slow Pointers", "Linked List", "Sliding Window", "Prefix Sum", "Binary Search"];
export const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

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
