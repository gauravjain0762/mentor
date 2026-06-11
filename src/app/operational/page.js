"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import styles from "./page.module.css";

const LOGS = [
  {
    mentor: { name: "Marcus Aurelius", role: "Lead Architect",   init: "MA" },
    pt:     { name: "Candidate Delta-4",                          init: "CD" },
    date:   "Oct 24, 2023",
    type:   "TRANSCRIPT\nREVIEW",
    typeClass: "transcript",
    duration: "02h 45m",
    notes:    "Analyzed psychological res...",
  },
  {
    mentor: { name: "Elena Vance",     role: "Security Officer", init: "EV" },
    pt:     { name: "Operative Kael",                             init: "OK" },
    date:   "Oct 24, 2023",
    type:   "ESCALATION\nSUPPORT",
    typeClass: "escalation",
    duration: "00h 50m",
    notes:    "Critical bypass of encryptio...",
  },
  {
    mentor: { name: "Theodore Thorne", role: "Data Analyst",     init: "TT" },
    pt:     { name: "Asset 09",                                   init: "A9" },
    date:   "Oct 23, 2023",
    type:   "RETENTION\nAUDIT",
    typeClass: "retention",
    duration: "04h 15m",
    notes:    "Full data sweep of personn...",
  },
  {
    mentor: { name: "Marcus Aurelius", role: "Lead Architect",   init: "MA" },
    pt:     { name: "Recruit J",                                  init: "RJ" },
    date:   "Oct 23, 2023",
    type:   "CHECK-IN",
    typeClass: "checkin",
    duration: "00h 15m",
    notes:    "Standard bi-weekly sanity...",
  },
  {
    mentor: { name: "Elena Vance",     role: "Security Officer", init: "EV" },
    pt:     { name: "Candidate Delta-4",                          init: "CD" },
    date:   "Oct 22, 2023",
    type:   "TRANSCRIPT\nREVIEW",
    typeClass: "transcript",
    duration: "01h 30m",
    notes:    "Review of audio logs from...",
  },
];

const SUMMARY = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#f8e396" strokeWidth="2"/>
        <polyline points="12,7 12,12 15,15" stroke="#f8e396" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "TOTAL DURATION (WEEKLY)",
    value: "142h 18m",
    valueClass: "white",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" fill="#f8e396" rx="1"/>
        <rect x="10" y="7" width="4" height="14" fill="#f8e396" rx="1"/>
        <rect x="17" y="3" width="4" height="18" fill="#f8e396" rx="1"/>
      </svg>
    ),
    label: "PEAK ACTIVITY DAY",
    value: "Tuesday",
    valueClass: "white",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#f8e396" strokeWidth="2" strokeLinejoin="round"/>
        <line x1="12" y1="9" x2="12" y2="13" stroke="#f8e396" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="17" r="1" fill="#f8e396"/>
      </svg>
    ),
    label: "PENDING AUDITS",
    value: "12 Logs",
    valueClass: "yellow",
  },
];

export default function OperationalPage() {
  const router = useRouter();
  const [dateRange,   setDateRange]   = useState("This Week");
  const [mentor,      setMentor]      = useState("All Mentors");
  const [personnel,   setPersonnel]   = useState("All Personnel");
  const [activityType,setActivityType]= useState("All Types");

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input className={styles.searchInput} placeholder="Global system search..." />
          </div>
          <div className={styles.topRight}>
            <button className={styles.iconBtn} aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button className={styles.iconBtn} aria-label="Settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <div className={styles.userInfo}>
              <div className={styles.userText}>
                <span className={styles.userName}>Chief Admin</span>
                <span className={styles.userClearance}>Lvl 4 Clearance</span>
              </div>
              <div className={styles.userAvatar}>CA</div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {/* Page header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Operational Time Log</h1>
              <p className={styles.pageSubtitle}>
                Comprehensive ledger of mentor-personnel engagement and duration. Analyze<br />
                operational efficiency across departments.
              </p>
            </div>
            <button className={styles.exportBtn} onClick={() => router.push("/operational/create")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Create Log
            </button>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            {[
              { label: "DATE RANGE",    value: dateRange,    options: ["This Week","Last Week","This Month"], set: setDateRange },
              { label: "MENTOR",        value: mentor,       options: ["All Mentors","Marcus Aurelius","Elena Vance","Theodore Thorne"], set: setMentor },
              { label: "PT PERSONNEL",  value: personnel,    options: ["All Personnel","Candidate Delta-4","Operative Kael","Asset 09"], set: setPersonnel },
              { label: "ACTIVITY TYPE", value: activityType, options: ["All Types","Transcript Review","Escalation Support","Retention Audit","Check-In"], set: setActivityType },
            ].map((f) => (
              <div key={f.label} className={styles.filterGroup}>
                <label className={styles.filterLabel}>{f.label}</label>
                <select
                  className={styles.filterSelect}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                >
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {["MENTOR","PT","DATE","ACTIVITY TYPE","DURATION","NOTES",""].map((h) => (
                    <th key={h} className={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LOGS.map((row, i) => (
                  <tr key={i} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.person}>
                        <div className={styles.personAvatar}>{row.mentor.init}</div>
                        <div>
                          <p className={styles.personName}>{row.mentor.name}</p>
                          <p className={styles.personRole}>{row.mentor.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.person}>
                        <div className={`${styles.personAvatar} ${styles.ptAvatar}`}>{row.pt.init}</div>
                        <p className={styles.personName}>{row.pt.name}</p>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateText}>{row.date}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.typeTag} ${styles[`type_${row.typeClass}`]}`}>
                        {row.type.split("\n").map((line, li) => (
                          <span key={li} className={styles.typeLine}>{line}</span>
                        ))}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.duration}>{row.duration}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.notes}>{row.notes}</span>
                    </td>
                    <td className={styles.td}>
                      <button className={styles.viewBtn}>View<br/>More</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>Showing 1 to 5 of 128 logs</span>
              <div className={styles.paginationBtns}>
                <button className={styles.pageBtn}>&#8249;</button>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <span className={styles.pageDots}>...</span>
                <button className={styles.pageBtn}>26</button>
                <button className={styles.pageBtn}>&#8250;</button>
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className={styles.summaryGrid}>
            {SUMMARY.map((s) => (
              <div key={s.label} className={styles.summaryCard}>
                <div className={styles.summaryIcon}>{s.icon}</div>
                <div>
                  <p className={styles.summaryLabel}>{s.label}</p>
                  <p className={`${styles.summaryValue} ${s.valueClass === "yellow" ? styles.summaryYellow : ""}`}>
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
