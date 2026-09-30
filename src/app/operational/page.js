"use client";

import { useState, Fragment } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";

const ACTIVITY_META = {
  TRANSCRIPT_REVIEW: { lines: ["TRANSCRIPT", "REVIEW"], cls: styles.badge_transcript },
  ESCALATION_SUPPORT: { lines: ["ESCALATION", "SUPPORT"], cls: styles.badge_escalation },
  RETENTION_AUDIT: { lines: ["RETENTION", "AUDIT"], cls: styles.badge_retention },
  CHECK_IN: { lines: ["CHECK-IN"], cls: styles.badge_checkin },
};

function formatDuration(mins) {
  const total = Number(mins) || 0;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
}

export default function OperationalPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("this_week");
  const [ptFilter, setPtFilter] = useState("");
  const [activityType, setActivityType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedSearch, setAppliedSearch] = useState("");

  const [expandedId, setExpandedId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { data: ptsData } = useSWR("/api/mentor/assigned-pts?limit=100");
  const pts = ptsData?.data?.pts || [];

  const logsParams = new URLSearchParams();
  logsParams.append("page", currentPage);
  logsParams.append("limit", "20");
  if (dateRange) logsParams.append("dateRange", dateRange);
  if (ptFilter) logsParams.append("ptId", ptFilter);
  if (activityType) logsParams.append("activityType", activityType);
  if (appliedSearch) logsParams.append("search", appliedSearch);
  const logsKey = `/api/mentor/operational-logs?${logsParams.toString()}`;

  const { data: logsData, isLoading: logsLoading, error: logsError, mutate: mutateLogs } = useSWR(logsKey, { keepPreviousData: true });
  const { data: statsData } = useSWR("/api/mentor/operational-logs/stats");

  const logs = logsData?.data?.logs || [];
  const pagination = logsData?.data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 };
  const stats = statsData?.data || null;
  const loading = logsLoading && !logsData;
  const error = logsError?.message || deleteError;

  const { data: expandedDetailData, isLoading: detailLoading } = useSWR(
    expandedId ? `/api/mentor/operational-logs/${expandedId}` : null
  );
  const expandedDetail = expandedDetailData?.data?.log || expandedDetailData?.data || null;

  function clearFilters() {
    setSearch("");
    setAppliedSearch("");
    setDateRange("this_week");
    setPtFilter("");
    setActivityType("");
    setCurrentPage(1);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setCurrentPage(1);
    setAppliedSearch(search);
  }

  function toggleViewMore(logId) {
    setExpandedId((prev) => (prev === logId ? null : logId));
  }

  async function handleDelete(logId) {
    if (!window.confirm("Delete this log entry? This cannot be undone.")) return;
    setDeletingId(logId);
    setDeleteError("");
    try {
      await apiFetch(`/api/mentor/operational-logs/${logId}`, { method: "DELETE" });
      if (expandedId === logId) setExpandedId(null);
      mutateLogs();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete log");
    } finally {
      setDeletingId(null);
    }
  }

  const pageStart = logs.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const pageEnd = (pagination.page - 1) * pagination.limit + logs.length;

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
            <div className={styles.filtersRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>DATE RANGE</label>
                <select className={styles.filterSelect} value={dateRange} onChange={(e) => { setDateRange(e.target.value); setCurrentPage(1); }}>
                  <option value="this_week">This Week</option>
                  <option value="last_week">Last Week</option>
                  <option value="this_month">This Month</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>PT PERSONNEL</label>
                <select className={styles.filterSelect} value={ptFilter} onChange={(e) => { setPtFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Personnel</option>
                  {pts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>ACTIVITY TYPE</label>
                <select className={styles.filterSelect} value={activityType} onChange={(e) => { setActivityType(e.target.value); setCurrentPage(1); }}>
                  <option value="">All Types</option>
                  <option value="TRANSCRIPT_REVIEW">Transcript Review</option>
                  <option value="ESCALATION_SUPPORT">Escalation Support</option>
                  <option value="RETENTION_AUDIT">Retention Audit</option>
                  <option value="CHECK_IN">Check-In</option>
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
                <p className={styles.statValue}>{stats ? formatDuration(stats.totalDurationMinutes) : "--"}</p>
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
                <p className={styles.statValue}>{stats ? `${stats.pendingAudits} Logs` : "--"}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <form className={styles.searchWrap} onSubmit={handleSearchSubmit}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Search PT, notes, or activity — press Enter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {error && (
            <p style={{ color: "#ff6b6b", fontSize: "12px", fontWeight: 600, margin: "-8px 0 14px" }}>{error}</p>
          )}

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
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "#666" }}>Loading logs...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "#666" }}>No logs found</td></tr>
                ) : (
                  logs.map((row) => {
                    const meta = ACTIVITY_META[row.activityType] || { lines: [row.activityType], cls: styles.badge_checkin };
                    return (
                      <Fragment key={row.id}>
                        <tr className={styles.tr}>
                          <td className={styles.td}>
                            <div className={styles.ptCell}>
                              <Image src={row.trainer?.avatarUrl || "https://i.pravatar.cc/150?img=11"} alt={row.trainer?.name || "PT"} width={32} height={32} unoptimized className={styles.ptAvatar} />
                              <span className={styles.ptName}>{row.trainer?.name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className={styles.td}>
                            <span className={styles.dateText}>{row.date ? new Date(row.date).toLocaleDateString("en-US") : "--"}</span>
                          </td>
                          <td className={styles.td}>
                            <span className={`${styles.badge} ${meta.cls}`}>
                              {meta.lines.map((line, li) => (
                                <span key={li} className={styles.badgeLine}>{line}</span>
                              ))}
                            </span>
                          </td>
                          <td className={styles.td}>
                            <span className={styles.duration}>{formatDuration(row.durationMinutes)}</span>
                          </td>
                          <td className={styles.td}>
                            <span className={styles.notes}>{row.notes}</span>
                          </td>
                          <td className={styles.td}>
                            <button className={styles.viewBtn} onClick={() => toggleViewMore(row.id)}>
                              {expandedId === row.id ? "Hide" : <>View<br />More</>}
                            </button>
                          </td>
                          <td className={styles.td}>
                            <button
                              className={styles.viewBtn}
                              style={{ color: "#ff6b6b" }}
                              disabled={deletingId === row.id}
                              onClick={() => handleDelete(row.id)}
                            >
                              {deletingId === row.id ? "..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                        {expandedId === row.id && (
                          <tr className={styles.tr}>
                            <td className={styles.td} colSpan={7} style={{ background: "#0a0a0a" }}>
                              {detailLoading ? (
                                <span style={{ color: "#666", fontSize: "11.5px" }}>Loading details...</span>
                              ) : (
                                <span style={{ color: "#aaa", fontSize: "11.5px", lineHeight: 1.6 }}>
                                  {expandedDetail?.notes || "No additional details."}
                                </span>
                              )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <span className={styles.pageInfo}>Showing {pageStart} to {pageEnd} of {pagination.total} logs</span>
              <div className={styles.pageBtns}>
                <button
                  className={styles.pageArrow}
                  disabled={pagination.page <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >&#8249;</button>
                {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`dots-${i}`} className={styles.pageDots}>...</span>
                    ) : (
                      <button
                        key={p}
                        className={`${styles.pageNum} ${p === pagination.page ? styles.pageActive : ""}`}
                        onClick={() => setCurrentPage(p)}
                      >{p}</button>
                    )
                  )}
                <button
                  className={styles.pageArrow}
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                >&#8250;</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
