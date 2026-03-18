import type { Problem, SolveRating, SourceKey, UserSettings } from "./types";

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

  // Trees
  { id: 55, name: "Binary Tree Inorder Traversal", pattern: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/binary-tree-inorder-traversal/", source: "LeetCode", builtIn: true, topics: ["Tree", "DFS"] },
  { id: 56, name: "Binary Tree Level Order Traversal", pattern: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", source: "LeetCode", builtIn: true, topics: ["Tree", "BFS"] },
  { id: 57, name: "Maximum Depth of Binary Tree", pattern: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", source: "LeetCode", builtIn: true, topics: ["Tree", "DFS"] },
  { id: 58, name: "Same Tree", pattern: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/same-tree/", source: "LeetCode", builtIn: true, topics: ["Tree", "DFS"] },
  { id: 59, name: "Invert Binary Tree", pattern: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/invert-binary-tree/", source: "LeetCode", builtIn: true, topics: ["Tree", "DFS"] },
  { id: 60, name: "Path Sum", pattern: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/path-sum/", source: "LeetCode", builtIn: true, topics: ["Tree", "DFS"] },
  { id: 61, name: "Lowest Common Ancestor of a Binary Tree", pattern: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", source: "LeetCode", builtIn: true, topics: ["Tree", "DFS"] },
  { id: 62, name: "Validate Binary Search Tree", pattern: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/", source: "LeetCode", builtIn: true, topics: ["Tree", "Binary Search Tree", "DFS"] },
  { id: 63, name: "Kth Smallest Element in a BST", pattern: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", source: "LeetCode", builtIn: true, topics: ["Tree", "Binary Search Tree", "DFS"] },
  { id: 64, name: "Binary Tree Right Side View", pattern: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-right-side-view/", source: "LeetCode", builtIn: true, topics: ["Tree", "BFS"] },
  { id: 65, name: "Serialize and Deserialize Binary Tree", pattern: "Trees", difficulty: "Hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", source: "LeetCode", builtIn: true, topics: ["Tree", "DFS", "Design"] },

  // Graphs
  { id: 66, name: "Number of Islands", pattern: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/", source: "LeetCode", builtIn: true, topics: ["Graph", "DFS", "BFS"] },
  { id: 67, name: "Clone Graph", pattern: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/", source: "LeetCode", builtIn: true, topics: ["Graph", "DFS", "BFS"] },
  { id: 68, name: "Course Schedule", pattern: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/", source: "LeetCode", builtIn: true, topics: ["Graph", "DFS", "BFS"] },
  { id: 69, name: "Pacific Atlantic Water Flow", pattern: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", source: "LeetCode", builtIn: true, topics: ["Graph", "DFS", "BFS"] },
  { id: 70, name: "Number of Connected Components in an Undirected Graph", pattern: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", source: "LeetCode", builtIn: true, topics: ["Graph", "Union Find", "DFS"] },
  { id: 71, name: "Graph Valid Tree", pattern: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/graph-valid-tree/", source: "LeetCode", builtIn: true, topics: ["Graph", "Union Find", "DFS"] },
  { id: 72, name: "Word Ladder", pattern: "Graphs", difficulty: "Hard", url: "https://leetcode.com/problems/word-ladder/", source: "LeetCode", builtIn: true, topics: ["Graph", "BFS", "String"] },
  { id: 73, name: "Alien Dictionary", pattern: "Graphs", difficulty: "Hard", url: "https://leetcode.com/problems/alien-dictionary/", source: "LeetCode", builtIn: true, topics: ["Graph", "DFS", "BFS"] },
  { id: 74, name: "Cheapest Flights Within K Stops", pattern: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", source: "LeetCode", builtIn: true, topics: ["Graph", "DFS", "BFS"] },
  { id: 75, name: "Network Delay Time", pattern: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/network-delay-time/", source: "LeetCode", builtIn: true, topics: ["Graph", "DFS", "BFS"] },
  { id: 76, name: "Rotting Oranges", pattern: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/rotting-oranges/", source: "LeetCode", builtIn: true, topics: ["Graph", "BFS", "Matrix"] },

  // Dynamic Programming
  { id: 77, name: "Climbing Stairs", pattern: "Dynamic Programming", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "Math"] },
  { id: 78, name: "House Robber", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "Array"] },
  { id: 79, name: "Coin Change", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "Array"] },
  { id: 80, name: "Longest Increasing Subsequence", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "Array"] },
  { id: 81, name: "Word Break", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/word-break/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "String", "Trie"] },
  { id: 82, name: "Unique Paths", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/unique-paths/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "Math"] },
  { id: 83, name: "Jump Game", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "Array", "Greedy"] },
  { id: 84, name: "Decode Ways", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/decode-ways/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "String"] },
  { id: 85, name: "Longest Common Subsequence", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "String"] },
  { id: 86, name: "Edit Distance", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/edit-distance/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "String"] },
  { id: 87, name: "Maximum Product Subarray", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-product-subarray/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "Array"] },
  { id: 88, name: "Partition Equal Subset Sum", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/partition-equal-subset-sum/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "Array"] },
  { id: 89, name: "Target Sum", pattern: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/target-sum/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "Array", "Backtracking"] },
  { id: 90, name: "Interleaving String", pattern: "Dynamic Programming", difficulty: "Hard", url: "https://leetcode.com/problems/interleaving-string/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "String"] },

  // Backtracking
  { id: 91, name: "Subsets", pattern: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/subsets/", source: "LeetCode", builtIn: true, topics: ["Array", "Backtracking"] },
  { id: 92, name: "Permutations", pattern: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/permutations/", source: "LeetCode", builtIn: true, topics: ["Array", "Backtracking"] },
  { id: 93, name: "Combination Sum", pattern: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum/", source: "LeetCode", builtIn: true, topics: ["Array", "Backtracking"] },
  { id: 94, name: "Letter Combinations of a Phone Number", pattern: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", source: "LeetCode", builtIn: true, topics: ["String", "Backtracking"] },
  { id: 95, name: "Palindrome Partitioning", pattern: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/palindrome-partitioning/", source: "LeetCode", builtIn: true, topics: ["String", "Backtracking", "DFS"] },
  { id: 96, name: "N-Queens", pattern: "Backtracking", difficulty: "Hard", url: "https://leetcode.com/problems/n-queens/", source: "LeetCode", builtIn: true, topics: ["Array", "Backtracking"] },
  { id: 97, name: "Word Search", pattern: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/word-search/", source: "LeetCode", builtIn: true, topics: ["Array", "Backtracking", "Matrix"] },
  { id: 98, name: "Sudoku Solver", pattern: "Backtracking", difficulty: "Hard", url: "https://leetcode.com/problems/sudoku-solver/", source: "LeetCode", builtIn: true, topics: ["Array", "Backtracking", "Matrix"] },

  // Stack & Queue
  { id: 99, name: "Valid Parentheses", pattern: "Stack & Queue", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/", source: "LeetCode", builtIn: true, topics: ["String", "Stack"] },
  { id: 100, name: "Min Stack", pattern: "Stack & Queue", difficulty: "Medium", url: "https://leetcode.com/problems/min-stack/", source: "LeetCode", builtIn: true, topics: ["Stack", "Design"] },
  { id: 101, name: "Daily Temperatures", pattern: "Stack & Queue", difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/", source: "LeetCode", builtIn: true, topics: ["Array", "Stack"] },
  { id: 102, name: "Evaluate Reverse Polish Notation", pattern: "Stack & Queue", difficulty: "Medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", source: "LeetCode", builtIn: true, topics: ["Array", "Stack", "Math"] },
  { id: 103, name: "Largest Rectangle in Histogram", pattern: "Stack & Queue", difficulty: "Hard", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", source: "LeetCode", builtIn: true, topics: ["Array", "Stack"] },
  { id: 104, name: "Implement Queue using Stacks", pattern: "Stack & Queue", difficulty: "Easy", url: "https://leetcode.com/problems/implement-queue-using-stacks/", source: "LeetCode", builtIn: true, topics: ["Stack", "Queue", "Design"] },
  { id: 105, name: "Decode String", pattern: "Stack & Queue", difficulty: "Medium", url: "https://leetcode.com/problems/decode-string/", source: "LeetCode", builtIn: true, topics: ["String", "Stack"] },
  { id: 106, name: "Asteroid Collision", pattern: "Stack & Queue", difficulty: "Medium", url: "https://leetcode.com/problems/asteroid-collision/", source: "LeetCode", builtIn: true, topics: ["Array", "Stack"] },
  { id: 107, name: "Online Stock Span", pattern: "Stack & Queue", difficulty: "Medium", url: "https://leetcode.com/problems/online-stock-span/", source: "LeetCode", builtIn: true, topics: ["Stack", "Design"] },

  // Heap / Priority Queue
  { id: 108, name: "Kth Largest Element in an Array", pattern: "Heap / Priority Queue", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", source: "LeetCode", builtIn: true, topics: ["Array", "Heap"] },
  { id: 109, name: "Top K Frequent Elements", pattern: "Heap / Priority Queue", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/", source: "LeetCode", builtIn: true, topics: ["Array", "Hash Table", "Heap"] },
  { id: 110, name: "Find Median from Data Stream", pattern: "Heap / Priority Queue", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/", source: "LeetCode", builtIn: true, topics: ["Heap", "Design"] },
  { id: 111, name: "Merge k Sorted Lists", pattern: "Heap / Priority Queue", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/", source: "LeetCode", builtIn: true, topics: ["Linked List", "Heap"] },
  { id: 112, name: "Task Scheduler", pattern: "Heap / Priority Queue", difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/", source: "LeetCode", builtIn: true, topics: ["Array", "Heap", "Greedy"] },
  { id: 113, name: "Reorganize String", pattern: "Heap / Priority Queue", difficulty: "Medium", url: "https://leetcode.com/problems/reorganize-string/", source: "LeetCode", builtIn: true, topics: ["String", "Heap", "Greedy"] },
  { id: 114, name: "K Closest Points to Origin", pattern: "Heap / Priority Queue", difficulty: "Medium", url: "https://leetcode.com/problems/k-closest-points-to-origin/", source: "LeetCode", builtIn: true, topics: ["Array", "Heap", "Math"] },
  { id: 115, name: "Smallest Range Covering Elements from K Lists", pattern: "Heap / Priority Queue", difficulty: "Hard", url: "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/", source: "LeetCode", builtIn: true, topics: ["Array", "Heap"] },

  // Greedy
  { id: 116, name: "Maximum Subarray", pattern: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-subarray/", source: "LeetCode", builtIn: true, topics: ["Array", "Dynamic Programming", "Greedy"] },
  { id: 117, name: "Jump Game II", pattern: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game-ii/", source: "LeetCode", builtIn: true, topics: ["Array", "Greedy"] },
  { id: 118, name: "Gas Station", pattern: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/gas-station/", source: "LeetCode", builtIn: true, topics: ["Array", "Greedy"] },
  { id: 119, name: "Hand of Straights", pattern: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/hand-of-straights/", source: "LeetCode", builtIn: true, topics: ["Array", "Hash Table", "Greedy", "Sorting"] },
  { id: 120, name: "Merge Triplets to Form Target Triplet", pattern: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/", source: "LeetCode", builtIn: true, topics: ["Array", "Greedy"] },
  { id: 121, name: "Partition Labels", pattern: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/partition-labels/", source: "LeetCode", builtIn: true, topics: ["String", "Greedy", "Hash Table"] },
  { id: 122, name: "Valid Parenthesis String", pattern: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/valid-parenthesis-string/", source: "LeetCode", builtIn: true, topics: ["String", "Greedy", "Stack"] },
  { id: 123, name: "Meeting Rooms II", pattern: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/meeting-rooms-ii/", source: "LeetCode", builtIn: true, topics: ["Array", "Greedy", "Sorting", "Heap"] },

  // Bit Manipulation
  { id: 124, name: "Single Number", pattern: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/single-number/", source: "LeetCode", builtIn: true, topics: ["Array", "Bit Manipulation"] },
  { id: 125, name: "Number of 1 Bits", pattern: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/number-of-1-bits/", source: "LeetCode", builtIn: true, topics: ["Bit Manipulation"] },
  { id: 126, name: "Counting Bits", pattern: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/counting-bits/", source: "LeetCode", builtIn: true, topics: ["Dynamic Programming", "Bit Manipulation"] },
  { id: 127, name: "Reverse Bits", pattern: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-bits/", source: "LeetCode", builtIn: true, topics: ["Bit Manipulation"] },
  { id: 128, name: "Missing Number", pattern: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/missing-number/", source: "LeetCode", builtIn: true, topics: ["Array", "Bit Manipulation", "Math"] },
  { id: 129, name: "Sum of Two Integers", pattern: "Bit Manipulation", difficulty: "Medium", url: "https://leetcode.com/problems/sum-of-two-integers/", source: "LeetCode", builtIn: true, topics: ["Bit Manipulation", "Math"] },
  { id: 130, name: "Hamming Distance", pattern: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/hamming-distance/", source: "LeetCode", builtIn: true, topics: ["Bit Manipulation"] },
];

/** @deprecated Use allProblems from useProblems hook instead */
export const PROBLEMS = BUILTIN_PROBLEMS;

/** Spaced repetition intervals (days after solving) */
export const DEFAULT_SPACED_DAYS = [3, 5, 9, 15];
export let SPACED_DAYS = [...DEFAULT_SPACED_DAYS];

export const DEFAULT_SETTINGS: UserSettings = {
  spacedDays: [3, 5, 9, 15],
  spacedPreset: "default",
  notificationsEnabled: false,
  notificationTime: "09:00",
  theme: "dark",
};

export const SPACED_PRESETS: Record<string, number[]> = {
  aggressive: [1, 3, 5, 10],
  default: [3, 5, 9, 15],
  relaxed: [3, 7, 14, 30],
};

export const BUILTIN_PATTERNS = [
  "Two Pointers", "Fast & Slow Pointers", "Linked List", "Sliding Window", "Prefix Sum", "Binary Search",
  "Trees", "Graphs", "Dynamic Programming", "Backtracking", "Stack & Queue", "Heap / Priority Queue", "Greedy", "Bit Manipulation",
];
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
  "Trees": "#22c55e",
  "Graphs": "#06b6d4",
  "Dynamic Programming": "#d946ef",
  "Backtracking": "#f43f5e",
  "Stack & Queue": "#eab308",
  "Heap / Priority Queue": "#14b8a6",
  "Greedy": "#f97316",
  "Bit Manipulation": "#6366f1",
};

export const BUILTIN_TOPICS = [
  "Array", "String", "Linked List", "Hash Table", "Math",
  "Sorting", "Stack", "Heap", "Matrix", "Greedy",
  "Recursion", "Design", "Deque", "Dynamic Programming",
  "Tree", "Binary Search Tree", "Graph", "BFS", "DFS",
  "Backtracking", "Bit Manipulation", "Trie", "Queue", "Union Find",
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
  "Tree": "#22c55e",
  "Binary Search Tree": "#16a34a",
  "Graph": "#0891b2",
  "BFS": "#38bdf8",
  "DFS": "#818cf8",
  "Backtracking": "#f43f5e",
  "Bit Manipulation": "#6366f1",
  "Trie": "#a78bfa",
  "Queue": "#fb923c",
  "Union Find": "#34d399",
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

export const TAB_KEYS = ["problems", "random", "today", "upcoming", "stats"] as const;
