import { useEffect } from "react";
import type { TabKey } from "../types";

interface ShortcutOptions {
  setTab: (tab: TabKey) => void;
  rollRandom: () => void;
  isModalOpen: boolean;
}

export function useKeyboardShortcuts({
  setTab,
  rollRandom,
  isModalOpen,
}: ShortcutOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (isModalOpen) return;

      switch (e.key) {
        case "1":
          setTab("problems");
          break;
        case "2":
          setTab("random");
          break;
        case "3":
          setTab("today");
          break;
        case "4":
          setTab("upcoming");
          break;
        case "r":
        case "R":
          if (!e.ctrlKey && !e.metaKey) rollRandom();
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setTab, rollRandom, isModalOpen]);
}
