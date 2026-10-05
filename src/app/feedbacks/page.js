"use client";

import { useState } from "react";
import useSWR from "swr";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Avatar from "@/components/Avatar";
import styles from "./page.module.css";

const SENTIMENT_META = {
  positive: { label: "POSITIVE", cls: styles.sentPositive },
  neutral: { label: "NEUTRAL", cls: styles.sentNeutral },
  critical: { label: "CRITICAL", cls: styles.sentCritical },
};

// The API doesn't return a sentiment field, so this is a purely cosmetic
// badge derived from the star rating - not something the server can filter by.
function sentimentFromRating(rating) {
  if (rating >= 4) return SENTIMENT_META.positive;
  if (rating === 3) return SENTIMENT_META.neutral;
  return SENTIMENT_META.critical;
}

function fullName(person) {
  if (!person) return "";
  return [person.firstName, person.lastName].filter(Boolean).join(" ");
}

function Stars({ count = 0, total = 5 }) {
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

export default function FeedbacksPage() {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const params = new URLSearchParams();
  if (ratingFilter !== "all") params.append("rating", ratingFilter);
  if (search) params.append("search", search);
  params.append("page", currentPage);
  params.append("pageSize", "10");
  const reviewsKey = `/api/session-reviews/mentor/me?${params.toString()}`;

  const { data, isLoading: loading, error: fetchErr } = useSWR(reviewsKey, { keepPreviousData: true });

  const reviews = data?.data?.reviews || [];
  const pagination = data?.data?.pagination || { page: 1, pageSize: 10, total: 0, totalPages: 1 };
  const averageRating = data?.data?.averageRating;
  const error = fetchErr?.message || "";

  function clearFilters() {
    setSearch("");
    setRatingFilter("all");
    setCurrentPage(1);
  }

  const pageStart = reviews.length === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const pageEnd = (pagination.page - 1) * pagination.pageSize + reviews.length;

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <TopBar />

        <div className={styles.content}>

          {/* Page header */}
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Feedbacks</h1>
            <p className={styles.pageSubtitle}>Client reviews left for your assigned trainers.</p>
          </div>

          {/* Stat cards */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#f8e396">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </div>
              <div>
                <p className={styles.statLabel}>AVERAGE RATING</p>
                <p className={styles.statValue}>{averageRating != null ? `${averageRating} / 5` : "--"}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#f8e396" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className={styles.statLabel}>TOTAL REVIEWS</p>
                <p className={styles.statValue}>{pagination.total ?? "--"}</p>
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
                  placeholder="Search by trainer or client"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <select className={styles.filterSelect} value={ratingFilter} onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <button className={styles.clearBtn} onClick={clearFilters}>CLEAR FILTERS</button>
            </div>
          </div>

          {error && (
            <p style={{ color: "#ff6b6b", fontSize: "12px", fontWeight: 600, margin: "-8px 0 14px" }}>{error}</p>
          )}

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>TRAINER</th>
                  <th className={styles.th}>CLIENT</th>
                  <th className={styles.th}>RATING</th>
                  <th className={styles.th}>FEEDBACK</th>
                  <th className={styles.th}>SENTIMENT</th>
                  <th className={styles.th}>DATE</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#666" }}>Loading feedback...</td></tr>
                ) : reviews.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#666" }}>No feedback found</td></tr>
                ) : (
                  reviews.map((review) => {
                    const sentiment = sentimentFromRating(review.rating);
                    const trainerName = fullName(review.trainer) || "Unknown";
                    const clientName = fullName(review.customer) || "Anonymous";
                    return (
                      <tr key={review.id} className={styles.tr}>
                        <td className={styles.td}>
                          <div className={styles.trainerCell}>
                            <Avatar src={null} name={trainerName} size={38} className={styles.trainerAvatar} />
                            <span className={styles.trainerName}>{trainerName}</span>
                          </div>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.clientName}>{clientName}</span>
                        </td>
                        <td className={styles.td}>
                          <Stars count={review.rating} />
                        </td>
                        <td className={styles.td}>
                          <p className={styles.feedbackText}>&quot;{review.comment}&quot;</p>
                        </td>
                        <td className={styles.td}>
                          <span className={`${styles.sentBadge} ${sentiment.cls}`}>{sentiment.label}</span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.dateText}>{review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-US") : "--"}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <span className={styles.pageInfo}>Showing {pageStart} to {pageEnd} of {pagination.total} feedback entries</span>
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
