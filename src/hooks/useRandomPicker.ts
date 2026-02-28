import { useState, useCallback, useRef, useEffect } from "react";
import type { Problem, ProblemProgress } from "../types";
import { PROBLEMS } from "../config";

export function useRandomPicker(progress: Record<number, ProblemProgress>) {
  const [randomPick, setRandomPick] = useState<Problem | null>(null);
  const [pickHistory, setPickHistory] = useState<Problem[]>([]);
  const [pickScope, setPickScope] = useState<"all" | "unsolved" | "solved">("unsolved");
  const [pickPattern, setPickPattern] = useState("All");
  const [pickDiff, setPickDiff] = useState("All");
  const [isRolling, setIsRolling] = useState(false);
  const [pickRevealed, setPickRevealed] = useState(false);
  const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pickPool = PROBLEMS.filter((p) => {
    if (pickScope === "unsolved" && progress[p.id]) return false;
    if (pickScope === "solved" && !progress[p.id]) return false;
    if (pickPattern !== "All" && p.pattern !== pickPattern) return false;
    if (pickDiff !== "All" && p.difficulty !== pickDiff) return false;
    return true;
  });

  // FIX: Use setTimeout chaining instead of setInterval for actual deceleration
  const rollRandomQuestion = useCallback(() => {
    if (pickPool.length === 0) return;
    setPickRevealed(false);
    setIsRolling(true);
    const maxTicks = 12;
    let tick = 0;

    function doTick() {
      const rand = pickPool[Math.floor(Math.random() * pickPool.length)];
      setRandomPick(rand);
      tick++;
      if (tick >= maxTicks) {
        setIsRolling(false);
        setPickHistory((h) => [rand, ...h.filter((x) => x.id !== rand.id)].slice(0, 10));
        rollTimeoutRef.current = null;
      } else {
        // Increasing delay for deceleration effect
        rollTimeoutRef.current = setTimeout(doTick, 80 + tick * 20);
      }
    }

    if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
    rollTimeoutRef.current = setTimeout(doTick, 80);
  }, [pickPool]);

  useEffect(() => {
    return () => {
      if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
    };
  }, []);

  return {
    randomPick,
    pickHistory,
    pickScope,
    pickPattern,
    pickDiff,
    isRolling,
    pickRevealed,
    pickPool,
    setPickScope,
    setPickPattern,
    setPickDiff,
    setPickRevealed,
    setPickHistory,
    rollRandomQuestion,
  };
}
