import { useState, useEffect, useCallback } from "react";
import type { UserSettings } from "../types";
import { DEFAULT_SETTINGS } from "../config";

const SETTINGS_KEY = "dsa-settings";

export function useSettings() {
  const [settings, setSettingsState] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch { /* ignore */ }
    return { ...DEFAULT_SETTINGS };
  });

  const save = useCallback((next: UserSettings) => {
    setSettingsState(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
  }, []);

  const updateSettings = useCallback(
    (partial: Partial<UserSettings>) => {
      save({ ...settings, ...partial });
    },
    [settings, save]
  );

  const resetSettings = useCallback(() => {
    save({ ...DEFAULT_SETTINGS });
  }, [save]);

  return { settings, updateSettings, resetSettings };
}
