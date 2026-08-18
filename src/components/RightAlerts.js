"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./RightAlerts.module.css";
import { apiFetch } from "@/lib/api";

const ALERT_TYPE_MAP = {
  no_confirmation: "warning",
  client_cancellation: "warning",
  no_show: "critical",
  reschedule_request: "info",
  schedule_conflict: "critical",
};

const TYPE_CONFIG = {
  critical: { color: "#ff6b6b", bg: "#3d0b0b", label: "CRITICAL",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="17" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  warning: { color: "#ffaa44", bg: "#3d1e00", label: "WARNING",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  info: { color: "#6baed6", bg: "#0d2040", label: "INFO",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="8" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  success: { color: "#5aaa5a", bg: "#0d2a1a", label: "OK",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        <polyline points="8,12 11,15 16,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
};

export default function RightAlerts() {
  const [open, setOpen] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      setLoading(true);
      const data = await apiFetch("/api/mentor/schedules/alerts?limit=10");
      const apiAlerts = data.data?.alerts || [];

      const transformed = apiAlerts.map(a => ({
        id: a.id,
        type: ALERT_TYPE_MAP[a.type] || "info",
        title: a.type.replace(/_/g, " ").toUpperCase(),
        desc: a.message,
        time: new Date(a.createdAt).toLocaleDateString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }));

      setAlerts(transformed);
    } catch (err) {
      console.log("Alerts not available");
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  const criticalWarningCount = alerts.filter(a => a.type === "critical" || a.type === "warning").length;

  if (!open) {
    return (
      <aside className={styles.collapsed} onClick={() => setOpen(true)} title="Open Alerts">
        <div className={styles.collapsedInner}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="#f8e396" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#f8e396" strokeWidth="2"/>
          </svg>
          <span className={styles.collapsedBadge}>{criticalWarningCount}</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="#f8e396" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#f8e396" strokeWidth="2"/>
          </svg>
          <span className={styles.headerTitle}>ALERTS</span>
          <span className={styles.badge}>{criticalWarningCount}</span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.clearBtn}>Clear All</button>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close alerts">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#666", fontSize: "12px" }}>Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#666", fontSize: "12px" }}>No alerts</div>
        ) : (
          alerts.map((a) => {
            const cfg = TYPE_CONFIG[a.type];
            return (
              <div key={a.id} className={styles.alertItem}>
                <div className={styles.strip} style={{ background: cfg.color }} />
                <div className={styles.alertBody}>
                  <div className={styles.alertTop}>
                    <span className={styles.alertBadge} style={{ background: cfg.bg, color: cfg.color }}>
                      <span style={{ color: cfg.color }}>{cfg.icon}</span>
                      {cfg.label}
                    </span>
                    <span className={styles.alertTime}>{a.time}</span>
                  </div>
                  <p className={styles.alertTitle}>{a.title}</p>
                  <p className={styles.alertDesc}>{a.desc}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
