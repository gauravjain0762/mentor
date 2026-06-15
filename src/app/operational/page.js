"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";

const LOGS = [
  {
    pt: { name: "Candidate Delta-4", img: "https://i.pravatar.cc/150?img=11" },
    date: "Oct 24, 2023",
    type: "TRANSCRIPT\nREVIEW",   typeClass: "transcript",
    duration: "82h 45m",
    notes: "Analyzed psychological res...",
  },
  {
    pt: { name: "Operative Kael",    img: "https://i.pravatar.cc/150?img=15" },
    date: "Oct 24, 2023",
    type: "ESCALATION\nSUPPORT",  typeClass: "escalation",
    duration: "00h 50m",
    notes: "Critical bypass of encryptio...",
  },
  {
    pt: { name: "Asset 09",          img: "https://i.pravatar.cc/150?img=5"  },
    date: "Oct 23, 2023",
    type: "RETENTION\nAUDIT",     typeClass: "retention",
    duration: "04h 15m",
    notes: "Full data sweep of personn...",
  },
  {
    pt: { name: "Recruit J",         img: "https://i.pravatar.cc/150?img=17" },
    date: "Oct 23, 2023",
    type: "CHECK-IN",             typeClass: "checkin",
    duration: "00h 15m",
    notes: "Standard bi-weekly sanity...",
  },
  {
    pt: { name: "Candidate Delta-4", img: "https://i.pravatar.cc/150?img=11" },
    date: "Oct 22, 2023",
    type: "TRANSCRIPT\nREVIEW",   typeClass: "transcript",
    duration: "01h 30m",
    notes: "Review of audio logs from...",
  },
];

export default function OperationalPage() {
  const router = useRouter();
  const [search,       setSearch]       = useState("");
  const [dateRange,    setDateRange]    = useState("This Week");
  const [personnel,    setPersonnel]    = useState("All Personnel");
  const [activityType, setActivityType] = useState("All Types");

  function clearFilters() {
    setSearch(""); setDateRange("This Week");
    setPersonnel("All Personnel"); setActivityType("All Types");
  }

  const filtered = LOGS.filter((r) => {
    const matchSearch = !search || r.pt.name.toLowerCase().includes(search.toLowerCase());
    const matchType   = activityType === "All Types" || r.type.replace("\n", " ").toLowerCase().includes(activityType.toLowerCase());
    return matchSearch && matchType;
  });

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <TopBar />

        <div className={styles.content}>

          {/* Page header */}
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.pageTitle}>Mentor Activity Center</h1>
              <p className={styles.pageSubtitle}>Monitor check-ins, reviews, escalations, and support activities.</p>
            </div>
            <div className={styles.headBtns}>
              <button className={styles.addBtn} onClick={() => router.push("/operational/add")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Log
              </button>
              <button className={styles.exportBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Export Log
              </button>
            </div>
          </div>

          {/* Filters card */}
          <div className={styles.filtersCard}>
            {/* Top row: dropdowns + clear button */}
            <div className={styles.filtersRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>DATE RANGE</label>
                <select className={styles.filterSelect} value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>This Month</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>PT PERSONNEL</label>
                <select className={styles.filterSelect} value={personnel} onChange={(e) => setPersonnel(e.target.value)}>
                  <option>All Personnel</option>
                  <option>Candidate Delta-4</option>
                  <option>Operative Kael</option>
                  <option>Asset 09</option>
                  <option>Recruit J</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>ACTIVITY TYPE</label>
                <select className={styles.filterSelect} value={activityType} onChange={(e) => setActivityType(e.target.value)}>
                  <option>All Types</option>
                  <option>Transcript Review</option>
                  <option>Escalation Support</option>
                  <option>Retention Audit</option>
                  <option>Check-In</option>
                </select>
              </div>

              <div className={styles.clearWrap}>
                <label className={styles.filterLabel}>&nbsp;</label>
                <button className={styles.clearBtn} onClick={clearFilters}>CLEAR FILTERS</button>
              </div>
            </div>

          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#f8e396" strokeWidth="2"/>
                  <polyline points="12,7 12,12 15,15" stroke="#f8e396" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className={styles.statLabel}>TOTAL DURATION</p>
                <p className={styles.statValue}>142h 18m</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#f8e396" strokeWidth="2"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="#f8e396" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="17" r="1" fill="#f8e396"/>
                </svg>
              </div>
              <div>
                <p className={styles.statLabel}>PENDING AUDITS</p>
                <p className={styles.statValue}>12 Logs</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className={styles.searchWrap}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Search PT, notes, or activity"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.thead}>
                  <th className={styles.th}>PT</th>
                  <th className={styles.th}>DATE</th>
                  <th className={styles.th}>ACTIVITY TYPE</th>
                  <th className={styles.th}>DURATION</th>
                  <th className={styles.th}>NOTES</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.ptCell}>
                        <Image src={row.pt.img} alt={row.pt.name} width={32} height={32} unoptimized className={styles.ptAvatar} />
                        <span className={styles.ptName}>{row.pt.name}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateText}>{row.date}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${styles[`badge_${row.typeClass}`]}`}>
                        {row.type.split("\n").map((line, li) => (
                          <span key={li} className={styles.badgeLine}>{line}</span>
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
              <span className={styles.pageInfo}>Showing 1 to {filtered.length} of 128 logs</span>
              <div className={styles.pageBtns}>
                <button className={styles.pageArrow}>&#8249;</button>
                <button className={`${styles.pageNum} ${styles.pageActive}`}>1</button>
                <button className={styles.pageNum}>2</button>
                <button className={styles.pageNum}>3</button>
                <span className={styles.pageDots}>...</span>
                <button className={styles.pageNum}>26</button>
                <button className={styles.pageArrow}>&#8250;</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
