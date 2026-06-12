"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import RightAlerts from "@/components/RightAlerts";
import styles from "./page.module.css";

const FILTER_KEYS = ["checkins", "transcripts", "retention", "escalations", "tickets"];

const FILTERS = [
  { key: "checkins",    label: "Check-ins",         color: "#162840" },
  { key: "transcripts", label: "Transcript Reviews", color: "#ffffff" },
  { key: "retention",   label: "Retention Audits",   color: "#1a2d4a" },
  { key: "escalations", label: "Escalations",        color: "#c0234a" },
  { key: "tickets",     label: "Support Tickets",    color: "#f8e396" },
];

const EVENT_COLORS = {
  navy: { bg: "#162840", text: "#7ec8e3" },
  pink: { bg: "#4a1030", text: "#ff7eb3" },
  blue: { bg: "#122040", text: "#6baed6" },
  gold: { bg: "#f8e396", text: "#000000" },
  teal: { bg: "#0d3530", text: "#4ecdc4" },
  gray: { bg: "#1e2a38", text: "#8eaac2" },
};

const EVENTS = {
  "2024-10-01": [{ title: "Owner Check-In",    sub: "A. Knight",   type: "navy", filter: "checkins"    }],
  "2024-10-03": [
    { title: "Escalation:V7",  sub: "Customer S.", type: "pink", filter: "escalations" },
    { title: "Transcript Rev.", sub: "PT Elena",   type: "pink", filter: "transcripts" },
  ],
  "2024-10-07": [{ title: "Retention Audit",   sub: "Internal",    type: "blue", filter: "retention"   }],
  "2024-10-08": [
    { title: "CEO Briefing",   sub: "Owner",       type: "gold", filter: "checkins"    },
    { title: "Ticket #4492",   sub: "Customer J.", type: "teal", filter: "tickets"     },
  ],
  "2024-10-11": [{ title: "System Maintenance", sub: "Dev Ops",   type: "gray", filter: "tickets"     }],
};

const CALENDAR = [
  [{d:29,m:"sep"},{d:30,m:"sep"},{d:1,m:"oct"},{d:2,m:"oct"},{d:3,m:"oct"},{d:4,m:"oct"},{d:5,m:"oct"}],
  [{d:6,m:"oct"},{d:7,m:"oct"},{d:8,m:"oct"},{d:9,m:"oct"},{d:10,m:"oct"},{d:11,m:"oct"},{d:12,m:"oct"}],
  [{d:13,m:"oct"},{d:14,m:"oct"},{d:15,m:"oct"},{d:16,m:"oct"},{d:17,m:"oct"},{d:18,m:"oct"},{d:19,m:"oct"}],
  [{d:20,m:"oct"},{d:21,m:"oct"},{d:22,m:"oct"},{d:23,m:"oct"},{d:24,m:"oct"},{d:25,m:"oct"},{d:26,m:"oct"}],
  [{d:27,m:"oct"},{d:28,m:"oct"},{d:29,m:"oct"},{d:30,m:"oct"},{d:31,m:"oct"},{d:1,m:"nov"},{d:2,m:"nov"}],
];

const TASKS = [
  { time: "09:00 AM", tag: "HIGH PRIORITY", tagType: "high",     title: "CEO Briefing",           desc: "Strategic alignment and quarterly goals review with the executive board." },
  { time: "11:30 AM", tag: "ROUTINE",       tagType: "routine",  title: "Ticket #4492 Audit",     desc: "Compliance check for high-value customer support interaction." },
  { time: "02:00 PM", tag: "INTERNAL",      tagType: "internal", title: "PT Performance Review",  desc: "Monthly evaluation of Lead PT Elena Vance's operational metrics." },
  { time: "04:00 PM", tag: "HIGH PRIORITY", tagType: "high",     title: "Client Escalation Call", desc: "Urgent follow-up with customer Priya Mehta regarding trainer conduct complaint." },
  { time: "05:30 PM", tag: "ROUTINE",       tagType: "routine",  title: "Schedule Sync",          desc: "Weekly trainer availability alignment and session slot reallocation." },
  { time: "07:00 PM", tag: "INTERNAL",      tagType: "internal", title: "Ops Report Submission",  desc: "End-of-day operational summary and KPI log submission to command." },
];

export default function SchedulesPage() {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState(new Set(FILTER_KEYS));

  const allSelected = activeFilters.size === FILTER_KEYS.length;

  function handleAll() {
    setActiveFilters(new Set(FILTER_KEYS));
  }

  function toggleFilter(key) {
    const next = new Set(activeFilters);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setActiveFilters(next);
  }

  function getVisibleEvents(dateKey) {
    if (!dateKey || !EVENTS[dateKey]) return [];
    return EVENTS[dateKey].filter((ev) => activeFilters.has(ev.filter));
  }

  return (
    <div className={styles.layout}>
      {/* Shared icon sidebar */}
      <Sidebar />

      {/* Schedule-specific panels */}
      <aside className={styles.panels}>
        {/* Event Filters */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionTitle}>EVENT FILTERS</p>
            <button
              className={allSelected ? styles.allBtnActive : styles.allBtn}
              onClick={handleAll}
            >ALL</button>
          </div>
          {FILTERS.map((f) => {
            const active = activeFilters.has(f.key);
            return (
              <label
                key={f.key}
                className={`${styles.filterRow} ${!active ? styles.filterDim : ""}`}
                onClick={() => toggleFilter(f.key)}
              >
                <span
                  className={styles.filterBox}
                  style={{
                    background: active ? f.color : "transparent",
                    border: f.color === "#ffffff"
                      ? `1px solid ${active ? "#aaa" : "#333"}`
                      : `1px solid ${active ? f.color : "#333"}`,
                  }}
                />
                <span className={styles.filterLabel}>{f.label}</span>
                <span className={`${styles.checkbox} ${active ? styles.checkboxActive : ""}`}>
                  {active && (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <polyline points="1.5,5 4,7.5 8.5,2" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </label>
            );
          })}
        </div>

        {/* Team Status */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>TEAM STATUS</p>
          {[
            { name: "Elena Vance",   role: "Trainer", online: true,  init: "EV" },
            { name: "Marcus Thorne", role: "Trainer", online: false, init: "MT" },
          ].map((m) => (
            <div key={m.name} className={styles.teamRow}>
              <div className={styles.memberWrap}>
                <div className={styles.memberAvatar}>{m.init}</div>
                <span className={`${styles.onlineDot} ${m.online ? styles.dotGreen : styles.dotGray}`} />
              </div>
              <div>
                <p className={styles.memberName}>{m.name}</p>
                <p className={styles.memberSub}>{m.role} · {m.online ? "Online" : "Offline"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trainers List */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>TRAINERS</p>
          {[
            { init: "JV", name: "Julian Vance",    role: "Elite Trainer", online: true  },
            { init: "AS", name: "Alistair Sterling",role: "Elite Trainer", online: true  },
            { init: "EC", name: "Evelyn Cross",    role: "Pro Trainer",   online: false },
            { init: "MT", name: "Marcus Thorne",   role: "Elite Trainer", online: true  },
            { init: "RK", name: "Ravi Kumar",      role: "Pro Trainer",   online: false },
            { init: "SD", name: "Sara Devi",       role: "Trainer",       online: true  },
          ].map((t) => (
            <div key={t.name} className={styles.trainerRow}>
              <div className={styles.memberWrap}>
                <div className={styles.memberAvatar}>{t.init}</div>
                <span className={`${styles.onlineDot} ${t.online ? styles.dotGreen : styles.dotGray}`} />
              </div>
              <div>
                <p className={styles.memberName}>{t.name}</p>
                <p className={styles.memberSub}>{t.role} · {t.online ? "Online" : "Offline"}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.topActions}>
            <button className={styles.iconBtn} aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
            <button className={styles.logout} onClick={() => router.push("/")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Logout
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.calHeader}>
            <h2 className={styles.monthTitle}>October 2024</h2>
            <div className={styles.navBtns}>
              <button className={styles.navBtn} aria-label="Previous">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className={styles.navBtn} aria-label="Next">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.calendar}>
            <div className={styles.dayHeaders}>
              {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d) => (
                <div key={d} className={styles.dayHeader}>{d}</div>
              ))}
            </div>
            {CALENDAR.map((week, wi) => (
              <div key={wi} className={styles.week}>
                {week.map((cell, ci) => {
                  const dateKey = cell.m === "oct"
                    ? `2024-10-${String(cell.d).padStart(2,"0")}`
                    : null;
                  const evs = getVisibleEvents(dateKey);
                  const isToday = dateKey === "2024-10-08";
                  const isOuter = cell.m !== "oct";
                  return (
                    <div key={ci} className={`${styles.cell} ${isOuter ? styles.cellOuter : ""}`}>
                      <div className={styles.cellTop}>
                        <span className={`${styles.dayNum} ${isOuter ? styles.dayNumOuter : ""} ${isToday ? styles.dayNumToday : ""}`}>
                          {cell.d}
                        </span>
                        {isToday && <span className={styles.todayDot} />}
                      </div>
                      <div className={styles.events}>
                        {evs.map((ev, ei) => (
                          <div
                            key={ei}
                            className={styles.event}
                            style={{ background: EVENT_COLORS[ev.type].bg, color: EVENT_COLORS[ev.type].text }}
                          >
                            <span className={styles.evTitle}>{ev.title}</span>
                            <span className={styles.evSub}>{ev.sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={styles.tasksSection}>
            <div className={styles.tasksHeader}>
              <h2 className={styles.tasksTitle}>Tasks for October 8, 2024</h2>
              <span className={styles.tasksBadge}>3 ITEMS SCHEDULED</span>
            </div>
            <div className={styles.taskGrid}>
              {TASKS.map((t) => (
                <div key={t.title} className={`${styles.taskCard} ${styles[`card_${t.tagType}`]}`}>
                  <div className={styles.taskTop}>
                    <span className={styles.taskTime}>{t.time}</span>
                    <span className={`${styles.taskTag} ${styles[`tag_${t.tagType}`]}`}>{t.tag}</span>
                  </div>
                  <p className={styles.taskTitle}>{t.title}</p>
                  <p className={styles.taskDesc}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <RightAlerts />
    </div>
  );
}
