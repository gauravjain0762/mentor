"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import styles from "./page.module.css";

const REVIEWS = [
  {
    init: "MK", name: "Master Kaelen",  role: "Lead Tactical",
    client: "A. Sterling",  clientId: "8842-X",
    rating: 5,
    feedback: "Exceptional drilling on the infiltration simulator. Kaelen's methodology is unlike anything offered in standard protocol.",
    sentiment: "positive", date: "Oct 12, 2023",
  },
  {
    init: "SV", name: "Sgt. Valerius",  role: "Ballistics Specialist",
    client: "Anonymous",    clientId: "9011-B",
    rating: 4,
    feedback: "Instructions were clear but the pace felt slightly rushed for advanced diagnostics.",
    sentiment: "neutral",  date: "Oct 11, 2023",
  },
  {
    init: "MS", name: "Major Silas",    role: "Strategic Intelligence",
    client: "J. Draken",    clientId: "7720-Y",
    rating: 5,
    feedback: "Silas provides insights that you simply can't find in manuals. The historical context alone is worth every session.",
    sentiment: "positive", date: "Oct 10, 2023",
  },
  {
    init: "CR", name: "Cmdr. Radek",    role: "Cyber Warfare",
    client: "T. Thorne",    clientId: "1105-Z",
    rating: 2,
    feedback: "Hardware malfunction during the drill. Instructor was unable to reset the node and the session ended prematurely.",
    sentiment: "critical", date: "Oct 09, 2023",
  },
];

const SENTIMENT = {
  positive: { label: "POSITIVE", bg: "#0d2a1a", color: "#22c55e" },
  neutral:  { label: "NEUTRAL",  bg: "#1e1e0a", color: "#f8e396" },
  critical: { label: "CRITICAL", bg: "#2a0a0a", color: "#ff6b6b" },
};

function Stars({ count, total = 5 }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i < count ? "#f8e396" : "none"}
          stroke={i < count ? "#f8e396" : "#333333"} strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function TrainerReviewPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = REVIEWS.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.feedback.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input className={styles.searchInput} placeholder="Search operational intelligence..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className={styles.topRight}>
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
          {/* Breadcrumb */}
          <p className={styles.breadcrumb}>
            REGISTRY &nbsp;/&nbsp; <span className={styles.breadCrumbActive}>PERSONNEL REVIEW</span>
          </p>

          {/* Page header */}
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.pageTitle}>Trainer Review Ledger</h1>
              <p className={styles.pageSubtitle}>
                High-fidelity qualitative analysis of field instructor performance. Monitoring sentiment and user<br/>
                satisfaction to ensure Aethelgard instructional standards remain unchallenged.
              </p>
            </div>
            <button className={styles.exportBtn}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              EXPORT REPORT
            </button>
          </div>

          {/* Summary cards */}
          <div className={styles.summaryRow}>
            <div className={styles.sumCard}>
              <p className={styles.sumLabel}>GLOBAL RATING</p>
              <div className={styles.sumVal}>
                <span className={styles.sumNum}>4.8</span>
                <span className={styles.sumUnit}>&nbsp;/ 5.0</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f8e396" style={{marginLeft:8}}>
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </div>
            </div>
            <div className={styles.sumCard}>
              <p className={styles.sumLabel}>TOTAL FEEDBACKS</p>
              <div className={styles.sumVal}>
                <span className={styles.sumNum}>12,482</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginLeft:8}}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#f8e396" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className={styles.sumCard}>
              <p className={styles.sumLabel}>CRITICAL SENTIMENT</p>
              <div className={styles.sumVal}>
                <span className={styles.sumNumCritical}>1.2%</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginLeft:8}}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#ff6b6b" strokeWidth="2"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="17" r="1" fill="#ff6b6b"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.filterSearch}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input className={styles.filterInput} placeholder="Search feedback text..." />
            </div>
            <select className={styles.filterSelect}>
              <option>All Trainers</option>
              <option>Master Kaelen</option>
              <option>Sgt. Valerius</option>
              <option>Major Silas</option>
              <option>Cmdr. Radek</option>
            </select>
            <select className={styles.filterSelect}>
              <option>All Ratings</option>
              <option>5 Stars</option>
              <option>4 Stars</option>
              <option>3 Stars</option>
              <option>2 Stars</option>
              <option>1 Star</option>
            </select>
            <button className={styles.dateBtn}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Last 30 Days
            </button>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>TRAINER REGISTRY</th>
                  <th className={styles.th}>CLIENT / ORIGIN</th>
                  <th className={styles.th}>RATING</th>
                  <th className={styles.th}>INTELLIGENCE (FEEDBACK)</th>
                  <th className={styles.th}>SENTIMENT</th>
                  <th className={styles.th}>TIMESTAMP</th>
                  <th className={styles.th}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const s = SENTIMENT[r.sentiment];
                  return (
                    <tr key={r.name} className={styles.trow}>
                      <td className={styles.td}>
                        <div className={styles.trainerCell}>
                          <div className={styles.trainerAvatar}>{r.init}</div>
                          <div>
                            <p className={styles.trainerName}>{r.name}</p>
                            <p className={styles.trainerRole}>{r.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <p className={styles.clientName}>{r.client}</p>
                        <p className={styles.clientId}>ID: {r.clientId}</p>
                      </td>
                      <td className={styles.td}><Stars count={r.rating} /></td>
                      <td className={styles.td}>
                        <p className={styles.feedbackText}>&quot;{r.feedback}&quot;</p>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.sentBadge} style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <p className={styles.dateText}>{r.date}</p>
                      </td>
                      <td className={styles.td}>
                        <button className={styles.chatBtn} aria-label="Open chat">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <span className={styles.pageInfo}>Showing 1–{filtered.length} of 12,482 operational reviews</span>
            <div className={styles.pageBtns}>
              <button className={styles.pageArrow} disabled>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {[1, 2, 3].map(n => (
                <button key={n} className={page === n ? styles.pageActive : styles.pageNum}
                  onClick={() => setPage(n)}>{n}</button>
              ))}
              <span className={styles.pageDots}>…</span>
              <button className={styles.pageNum}>312</button>
              <button className={styles.pageArrow}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
