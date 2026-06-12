"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./RightAlerts.module.css";

const ALERTS = [
  {
    type: "critical",
    title: "Trainer Not Responding",
    desc: "Trainer Ravi Sharma has not shown up for 2 sessions today",
    time: "8m ago",
  },
  {
    type: "critical",
    title: "Customer Complaint",
    desc: "Member Priya Mehta complained about rude behaviour by Trainer Jay",
    time: "22m ago",
  },
  {
    type: "warning",
    title: "Trainer Late",
    desc: "Trainer Marcus was 40 mins late for morning batch",
    time: "1h ago",
  },
  {
    type: "warning",
    title: "Equipment Complaint",
    desc: "Customer Arjun reported treadmill #3 is broken since yesterday",
    time: "1h ago",
  },
  {
    type: "critical",
    title: "No Show — Trainer",
    desc: "Trainer Elena Vance absent without notice for evening slot",
    time: "2h ago",
  },
  {
    type: "warning",
    title: "Diet Plan Delay",
    desc: "Trainer Sam has not updated diet plans for 5 customers this week",
    time: "3h ago",
  },
  {
    type: "info",
    title: "Refund Requested",
    desc: "Customer Neha Gupta requesting refund citing poor trainer support",
    time: "4h ago",
  },
  {
    type: "warning",
    title: "Hygiene Complaint",
    desc: "Multiple members reported changing room cleanliness issue",
    time: "5h ago",
  },
  {
    type: "info",
    title: "Session Skipped",
    desc: "Trainer Dev skipped Sunday batch without informing customers",
    time: "6h ago",
  },
  {
    type: "critical",
    title: "Injury Report",
    desc: "Customer Rohit filed injury complaint during Trainer Jay's session",
    time: "8h ago",
  },
];

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

  if (!open) {
    return (
      <aside className={styles.collapsed} onClick={() => setOpen(true)} title="Open Alerts">
        <div className={styles.collapsedInner}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="#f8e396" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#f8e396" strokeWidth="2"/>
          </svg>
          <span className={styles.collapsedBadge}>{ALERTS.filter(a => a.type === "critical" || a.type === "warning").length}</span>
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
          <span className={styles.badge}>{ALERTS.filter(a => a.type === "critical" || a.type === "warning").length}</span>
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
        {ALERTS.map((a, i) => {
          const cfg = TYPE_CONFIG[a.type];
          return (
            <div key={i} className={styles.alertItem}>
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
        })}
      </div>
    </aside>
  );
}
