"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";

const PRIORITY_META = {
  CRITICAL: { dot: styles.dotRed,    label: "CRITICAL" },
  HIGH:     { dot: styles.dotOrange, label: "HIGH" },
  ROUTINE:  { dot: styles.dotGreen,  label: "ROUTINE" },
};

const STATUS_META = {
  OPEN:     styles.statusOpen,
  IN_REVIEW: styles.statusPending,
  RESOLVED: styles.statusResolved,
};

const CATEGORY_META = {
  CONDUCT:     styles.catConduct,
  TECHNICAL:   styles.catTechnical,
  PERFORMANCE: styles.catPerformance,
};

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAllData();
  }, [statusFilter, priorityFilter, currentPage]);

  async function fetchAllData() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter.toUpperCase());
      if (priorityFilter !== "all") params.append("priority", priorityFilter.toUpperCase());
      if (search) params.append("search", search);
      params.append("page", currentPage);
      params.append("limit", "20");

      const [reportsData, activitiesData, summaryData, statsData] = await Promise.all([
        apiFetch(`/api/mentor/reports?${params.toString()}`),
        apiFetch("/api/mentor/reports/activity/feed?limit=10"),
        apiFetch("/api/mentor/reports/summary"),
        apiFetch("/api/mentor/reports/stats?period=month"),
      ]);

      setReports(reportsData.data?.reports || []);
      setActivities(activitiesData.data?.activities || []);
      setSummary(summaryData.data?.summary || {});
      setStats(statsData.data?.stats || {});
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(reportId, newStatus) {
    try {
      await apiFetch(`/api/mentor/reports/${reportId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAllData();
    } catch (err) {
      console.error("Failed to update report:", err);
    }
  }

  const filtered = reports.filter((t) =>
    !search ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.trainerName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <TopBar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)", color: "#666" }}>Loading reports...</div>
      </main>
    </div>
  );

  if (error) return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <TopBar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)", color: "#ff6b6b" }}>{error}</div>
      </main>
    </div>
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
              <p className={styles.pageSubtitle}>Manage and resolve trainer-related reports and incidents.</p>
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
                <p className={styles.statValue}>{summary?.openCount || 0}</p>
                <span className={styles.badgeStat + " " + styles.badgeGreen}>Active</span>
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
                <p className={styles.statValue}>{stats?.resolvedReports || 0}</p>
                <span className={styles.badgeStat + " " + styles.badgeGrey}>This period</span>
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
                <p className={styles.statLabel}>CRITICAL</p>
                <p className={styles.statValueRed}>{summary?.criticalCount || 0}</p>
                <span className={styles.badgeStat + " " + styles.badgeRed}>Needs Action</span>
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
                <p className={styles.statLabel}>TOTAL REPORTS</p>
                <p className={styles.statValue}>{stats?.totalReports || 0}</p>
                <span className={styles.badgeStat + " " + styles.badgeGrey}>All time</span>
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
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <select className={styles.filterIconBtn} style={{ padding: "6px 10px", background: "none", border: "1px solid #333", borderRadius: "6px", color: "#aaa" }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
              </select>
              <select className={styles.filterIconBtn} style={{ padding: "6px 10px", background: "none", border: "1px solid #333", borderRadius: "6px", color: "#aaa" }} value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="routine">Routine</option>
              </select>
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
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: "20px", color: "#666" }}>No reports found</td></tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className={styles.tr}>
                      <td className={styles.td}>
                        <span className={styles.ticketId}>{row.id}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.trainerCell}>
                          <Image src={row.trainerAvatar || "https://i.pravatar.cc/150?img=11"} alt={row.trainerName} width={28} height={28} unoptimized className={styles.avatar} />
                          <span className={styles.trainerName}>{row.trainerName}</span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.reporter}>{row.reporterName}</span>
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
                        <select className={`${styles.statusBadge} ${STATUS_META[row.status]}`} value={row.status} onChange={(e) => handleStatusUpdate(row.id, e.target.value)} style={{ background: "inherit", border: "none", color: "inherit", cursor: "pointer" }}>
                          <option value="OPEN">Open</option>
                          <option value="IN_REVIEW">In Review</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.dateText}>{new Date(row.date).toLocaleDateString()}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actions}>
                          <button className={styles.actionBtn} title="View">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <span className={styles.pageInfo}>Showing page {currentPage} of {Math.ceil((stats?.totalReports || 0) / 20) || 1}</span>
              <div className={styles.pageBtns}>
                <button className={styles.pageArrow} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>&#8249;</button>
                {[1, 2, 3].map((p) => (
                  <button key={p} className={`${styles.pageNum} ${currentPage === p ? styles.pageActive : ""}`} onClick={() => setCurrentPage(p)}>{p}</button>
                ))}
                <span className={styles.pageDots}>...</span>
                <button className={styles.pageArrow} onClick={() => setCurrentPage(currentPage + 1)}>&#8250;</button>
              </div>
            </div>
          </div>

          {/* Bottom grid */}
          <div className={styles.bottomGrid}>

            {/* Recent Activity */}
            <div className={styles.bottomCard}>
              <div className={styles.bottomCardHead}>
                <span className={styles.bottomCardTitle}>Recent Activity Stream</span>
                <span className={styles.syncBadge}>LIVE</span>
              </div>
              <div className={styles.activityList}>
                {activities.length === 0 ? (
                  <p style={{ color: "#666", padding: "10px 0" }}>No recent activities</p>
                ) : (
                  activities.map((a) => (
                    <div key={a.id} className={styles.activityItem}>
                      <span className={`${styles.activityDot} ${a.severity === "high" ? styles.actDotYellow : styles.actDotGreen}`} />
                      <div>
                        <p className={styles.activityText}>
                          {a.text}
                          {a.relatedReportId && <span className={styles.activityLink}>{a.relatedReportId}</span>}
                        </p>
                        <p className={styles.activityTime}>{new Date(a.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Report Stats */}
            <div className={styles.bottomCard}>
              <div className={styles.bottomCardHead}>
                <span className={styles.bottomCardTitle}>Report Statistics</span>
              </div>
              <div className={styles.healthList}>
                <div className={styles.healthItem}>
                  <div className={styles.healthRow}>
                    <span className={styles.healthLabel}>CRITICAL REPORTS</span>
                    <span className={styles.healthVal}>{stats?.byPriority?.CRITICAL || 0}</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: `${Math.min(100, ((stats?.byPriority?.CRITICAL || 0) / (stats?.totalReports || 1)) * 100)}%`, background: "#ff6b6b" }} />
                  </div>
                </div>
                <div className={styles.healthItem}>
                  <div className={styles.healthRow}>
                    <span className={styles.healthLabel}>UNRESOLVED %</span>
                    <span className={styles.healthVal}>{stats?.unresolvedPercentage || 0}%</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: `${stats?.unresolvedPercentage || 0}%` }} />
                  </div>
                </div>
              </div>
              <p className={styles.healthFooter}>
                {stats?.totalReports || 0} total reports tracked • Avg resolution: {stats?.avgResolutionTime || "N/A"}
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
