"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";

const TICKETS = [
  {
    id: "TR-4029",
    trainer: { name: "Marcus Thorne", img: "https://i.pravatar.cc/150?img=15" },
    reporter: "L. Kensington",
    category: "CONDUCT",
    priority: "CRITICAL",
    status: "OPEN",
    date: "Oct 24, 2024",
  },
  {
    id: "TR-3991",
    trainer: { name: "Elena Vance", img: "https://i.pravatar.cc/150?img=11" },
    reporter: "S. Hashimoto",
    category: "TECHNICAL",
    priority: "ROUTINE",
    status: "PENDING",
    date: "Oct 23, 2024",
  },
  {
    id: "TR-3985",
    trainer: { name: "Dorian Gray", img: "https://i.pravatar.cc/150?img=17" },
    reporter: "Admin Sync",
    category: "PERFORMANCE",
    priority: "HIGH",
    status: "RESOLVED",
    date: "Oct 21, 2024",
  },
  {
    id: "TR-3972",
    trainer: { name: "Alistair Sterling", img: "https://i.pravatar.cc/150?img=12" },
    reporter: "J. Mercer",
    category: "CONDUCT",
    priority: "HIGH",
    status: "OPEN",
    date: "Oct 20, 2024",
  },
  {
    id: "TR-3960",
    trainer: { name: "Evelyn Cross", img: "https://i.pravatar.cc/150?img=5" },
    reporter: "M. Dantes",
    category: "TECHNICAL",
    priority: "ROUTINE",
    status: "RESOLVED",
    date: "Oct 19, 2024",
  },
];

const ACTIVITY = [
  { id: 1, text: "System automatically upgraded", link: "TR-4029", suffix: "to Critical.", time: "2 minutes ago", dot: "yellow" },
  { id: 2, text: "Lead Admin Cmdr. Vael assigned to TR-3991.", time: "14 minutes ago", dot: "green" },
  { id: 3, text: "New report submitted for Trainer Marcus Thorne.", time: "1 hour ago", dot: "yellow" },
  { id: 4, text: "TR-3960 closed after resolution confirmed.", time: "3 hours ago", dot: "green" },
];

const PRIORITY_META = {
  CRITICAL: { dot: styles.dotRed,    label: "CRITICAL" },
  HIGH:     { dot: styles.dotOrange, label: "HIGH" },
  ROUTINE:  { dot: styles.dotGreen,  label: "ROUTINE" },
};

const STATUS_META = {
  OPEN:     styles.statusOpen,
  PENDING:  styles.statusPending,
  RESOLVED: styles.statusResolved,
};

const CATEGORY_META = {
  CONDUCT:     styles.catConduct,
  TECHNICAL:   styles.catTechnical,
  PERFORMANCE: styles.catPerformance,
};

export default function ReportsPage() {
  const [search,  setSearch]  = useState("");
  const [view,    setView]    = useState("All Reports");

  const filtered = TICKETS.filter((t) =>
    !search ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.trainer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <TopBar />

        <div className={styles.content}>

          {/* Page header */}
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.pageTitle}>Support Reports</h1>
              <p className={styles.pageSubtitle}>Manage and resolve user support requests across the Aethelgard platform.</p>
            </div>
          </div>

          {/* Stat cards */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="#f8e396" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" stroke="#f8e396" strokeWidth="2"/>
                  <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" stroke="#f8e396" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <p className={styles.statLabel}>OPEN TICKETS</p>
                <p className={styles.statValue}>24</p>
                <span className={styles.badgeStat + " " + styles.badgeGreen}>25% vs last week</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#f8e396" strokeWidth="2"/>
                  <polyline points="7 12 10 15 17 9" stroke="#f8e396" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className={styles.statLabel}>RESOLVED</p>
                <p className={styles.statValue}>156</p>
                <span className={styles.badgeStat + " " + styles.badgeGrey}>Total lifetime</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconRed}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#ff6b6b" strokeWidth="2"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="17" r="1" fill="#ff6b6b"/>
                </svg>
              </div>
              <div>
                <p className={styles.statLabel}>HIGH PRIORITY</p>
                <p className={styles.statValueRed}>08</p>
                <span className={styles.badgeStat + " " + styles.badgeRed}>Critical Attention Required</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="#f8e396" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="#f8e396" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="#f8e396" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="#f8e396" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <p className={styles.statLabel}>TOTAL LOGS</p>
                <p className={styles.statValue}>1,204</p>
                <span className={styles.badgeStat + " " + styles.badgeGrey}>Active Database</span>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className={styles.filterBar}>
            <div className={styles.filterLeft}>
              <div className={styles.searchWrap}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  className={styles.searchInput}
                  placeholder="Filter by Trainer or ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className={styles.filterIconBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="11" y1="18" x2="13" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className={styles.viewToggle}>
              {["All Reports", "Priority", "Archive"].map((v) => (
                <button
                  key={v}
                  className={`${styles.viewBtn} ${view === v ? styles.viewBtnActive : ""}`}
                  onClick={() => setView(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.thead}>
                  <th className={styles.th}>TICKET ID</th>
                  <th className={styles.th}>TRAINER</th>
                  <th className={styles.th}>REPORTER</th>
                  <th className={styles.th}>CATEGORY</th>
                  <th className={styles.th}>PRIORITY</th>
                  <th className={styles.th}>STATUS</th>
                  <th className={styles.th}>DATE</th>
                  <th className={styles.th}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.ticketId}>{row.id}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.trainerCell}>
                        <Image src={row.trainer.img} alt={row.trainer.name} width={28} height={28} unoptimized className={styles.avatar} />
                        <span className={styles.trainerName}>{row.trainer.name}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.reporter}>{row.reporter}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.catBadge} ${CATEGORY_META[row.category]}`}>{row.category}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.priorityCell}>
                        <span className={`${styles.priorityDot} ${PRIORITY_META[row.priority].dot}`} />
                        <span className={styles.priorityText}>{row.priority}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.statusBadge} ${STATUS_META[row.status]}`}>{row.status}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateText}>{row.date}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} title="View">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                        <button className={styles.actionBtn} title="Edit">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <span className={styles.pageInfo}>Showing 1-25 of 1,204 records</span>
              <div className={styles.pageBtns}>
                <button className={styles.pageArrow}>&#8249;</button>
                <button className={`${styles.pageNum} ${styles.pageActive}`}>1</button>
                <button className={styles.pageNum}>2</button>
                <button className={styles.pageNum}>3</button>
                <span className={styles.pageDots}>...</span>
                <button className={styles.pageNum}>48</button>
                <button className={styles.pageArrow}>&#8250;</button>
              </div>
            </div>
          </div>

          {/* Bottom grid */}
          <div className={styles.bottomGrid}>

            {/* Recent Activity */}
            <div className={styles.bottomCard}>
              <div className={styles.bottomCardHead}>
                <span className={styles.bottomCardTitle}>Recent Activity Stream</span>
                <span className={styles.syncBadge}>REAL-TIME SYNC</span>
              </div>
              <div className={styles.activityList}>
                {ACTIVITY.map((a) => (
                  <div key={a.id} className={styles.activityItem}>
                    <span className={`${styles.activityDot} ${a.dot === "green" ? styles.actDotGreen : styles.actDotYellow}`} />
                    <div>
                      <p className={styles.activityText}>
                        {a.text}{" "}
                        {a.link && <span className={styles.activityLink}>{a.link}</span>}
                        {a.suffix && " " + a.suffix}
                      </p>
                      <p className={styles.activityTime}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className={styles.bottomCard}>
              <div className={styles.bottomCardHead}>
                <span className={styles.bottomCardTitle}>System Health</span>
              </div>
              <div className={styles.healthList}>
                <div className={styles.healthItem}>
                  <div className={styles.healthRow}>
                    <span className={styles.healthLabel}>DATABASE LATENCY</span>
                    <span className={styles.healthVal}>12ms</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: "18%" }} />
                  </div>
                </div>
                <div className={styles.healthItem}>
                  <div className={styles.healthRow}>
                    <span className={styles.healthLabel}>TICKET LOAD</span>
                    <span className={styles.healthVal}>Optimal</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: "65%" }} />
                  </div>
                </div>
              </div>
              <p className={styles.healthFooter}>
                All auxiliary systems are operating within nominal parameters for Sector 7 Admin Control.
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
