import { useState, useEffect } from "react";
import type { UserSettings } from "../types";
import { SPACED_PRESETS } from "../config";

interface Props {
  open: boolean;
  settings: UserSettings;
  onUpdate: (partial: Partial<UserSettings>) => void;
  onReset: () => void;
  onClose: () => void;
  notificationPermission: string;
  onRequestNotifications: () => Promise<boolean>;
  theme: string;
  onThemeChange: (theme: "dark" | "light" | "system") => void;
}

export function SettingsModal({
  open,
  settings,
  onUpdate,
  onReset,
  onClose,
  notificationPermission,
  onRequestNotifications,
  theme,
  onThemeChange,
}: Props) {
  const [customDays, setCustomDays] = useState(settings.spacedDays.join(", "));

  useEffect(() => {
    if (open) setCustomDays(settings.spacedDays.join(", "));
  }, [open, settings.spacedDays]);

  if (!open) return null;

  const handlePreset = (preset: string) => {
    const days = SPACED_PRESETS[preset];
    if (days) {
      onUpdate({ spacedDays: days, spacedPreset: preset as UserSettings["spacedPreset"] });
      setCustomDays(days.join(", "));
    }
  };

  const handleCustomDays = () => {
    const parsed = customDays
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0)
      .sort((a, b) => a - b);
    if (parsed.length >= 2 && parsed.length <= 8) {
      onUpdate({ spacedDays: parsed, spacedPreset: "custom" });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative glass-card w-full max-w-lg p-6 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-heading">Settings</h2>
          <button
            onClick={onClose}
            className="transition-colors text-xl leading-none"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Theme */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-primary)" }}>
            Appearance
          </h3>
          <div className="flex gap-2">
            {(["dark", "light", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`pill ${theme === t ? "pill-active bg-blue-600/20 border-blue-500/50 text-blue-400" : "bg-surface-700/50 border-surface-600/50 text-surface-400"}`}
              >
                {t === "dark" ? "🌙" : t === "light" ? "☀️" : "💻"} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Spaced Repetition */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-primary)" }}>
            Spaced Repetition Intervals
          </h3>
          <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
            Days after solving when revisions are scheduled. Only applies to newly solved problems.
          </p>
          <div className="flex gap-2 mb-3 flex-wrap">
            {Object.entries(SPACED_PRESETS).map(([key, days]) => (
              <button
                key={key}
                onClick={() => handlePreset(key)}
                className={`pill ${settings.spacedPreset === key ? "pill-active bg-blue-600/20 border-blue-500/50 text-blue-400" : "bg-surface-700/50 border-surface-600/50 text-surface-400"}`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} ({days.join(",")})
              </button>
            ))}
            <button
              onClick={() => onUpdate({ spacedPreset: "custom" })}
              className={`pill ${settings.spacedPreset === "custom" ? "pill-active bg-blue-600/20 border-blue-500/50 text-blue-400" : "bg-surface-700/50 border-surface-600/50 text-surface-400"}`}
            >
              Custom
            </button>
          </div>
          {settings.spacedPreset === "custom" && (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                placeholder="e.g. 1, 3, 7, 14"
                className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
              />
              <button
                onClick={handleCustomDays}
                className="btn-primary text-xs px-3 py-2"
              >
                Apply
              </button>
            </div>
          )}
          <div className="mt-2 flex gap-2">
            {settings.spacedDays.map((d, i) => (
              <span key={i} className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full font-semibold">
                Day {d}
              </span>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-primary)" }}>
            Notifications
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>Daily revision reminders</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {notificationPermission === "granted"
                  ? "Notifications enabled"
                  : notificationPermission === "denied"
                    ? "Notifications blocked by browser"
                    : "Get reminded when revisions are due"}
              </p>
            </div>
            <button
              onClick={async () => {
                if (notificationPermission !== "granted") {
                  const ok = await onRequestNotifications();
                  if (ok) onUpdate({ notificationsEnabled: true });
                } else {
                  onUpdate({ notificationsEnabled: !settings.notificationsEnabled });
                }
              }}
              disabled={notificationPermission === "denied"}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                settings.notificationsEnabled && notificationPermission === "granted"
                  ? "bg-blue-600"
                  : "bg-surface-600"
              } ${notificationPermission === "denied" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              role="switch"
              aria-checked={settings.notificationsEnabled}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.notificationsEnabled && notificationPermission === "granted"
                    ? "translate-x-5"
                    : ""
                }`}
              />
            </button>
          </div>
          {settings.notificationsEnabled && notificationPermission === "granted" && (
            <div className="mt-3 flex items-center gap-2">
              <label className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Remind at:</label>
              <input
                type="time"
                value={settings.notificationTime}
                onChange={(e) => onUpdate({ notificationTime: e.target.value })}
                className="rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
              />
            </div>
          )}
        </section>

        {/* Reset */}
        <div className="flex justify-between pt-4 border-t border-surface-700/50">
          <button
            onClick={onReset}
            className="btn-danger text-xs"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="btn-primary text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
