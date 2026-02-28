import { useState, useEffect, useCallback } from "react";
import type { TabKey } from "../types";
import { TAB_KEYS } from "../config";

function getTabFromHash(): TabKey {
  const hash = window.location.hash.replace("#", "");
  if ((TAB_KEYS as readonly string[]).includes(hash)) return hash as TabKey;
  return "problems";
}

export function useHashTab() {
  const [tab, setTabState] = useState<TabKey>(getTabFromHash);

  useEffect(() => {
    function onHashChange() {
      setTabState(getTabFromHash());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setTab = useCallback((t: TabKey) => {
    window.location.hash = t;
    setTabState(t);
  }, []);

  return [tab, setTab] as const;
}
