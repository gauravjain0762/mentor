"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Avatar from "@/components/Avatar";
import styles from "./page.module.css";

export default function PTDashboardPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);

  const { data, isLoading: loading, error: fetchErr } = useSWR("/api/mentor/assigned-pts?sort=rating&limit=10");
  const error = fetchErr?.message || "";

  const pts = data?.data?.pts || [];
  const trainers = pts.map((pt) => ({
    id: pt.id,
    name: pt.name,
    tier: pt.experience > 5 ? "Elite Tier Trainer" : "Pro Tier Trainer",
    gym: "Nexus Central Hub",
    location: pt.location || "London, UK",
    // pravatar.cc is a seeded demo avatar service; its images are not trainer photos.
    img: pt.avatar && !pt.avatar.includes("pravatar.cc") ? pt.avatar : null,
    totalClients: pt.totalClients || 0,
    rating: pt.rating || 4.0,
    status: pt.rating >= 4.5 ? "healthy" : pt.rating >= 4.0 ? "warning" : "critical",
  }));

  const stats = {
    total: data?.data?.total || 0,
    healthy: pts.filter((p) => p.rating >= 4.5).length,
    warnings: pts.filter((p) => p.rating >= 4.0 && p.rating < 4.5).length,
    critical: 0,
  };

  function toggleMenu(name) {
    setOpenMenu((prev) => (prev === name ? null : name));
  }

  const filtered = trainers;

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <TopBar />

        <div className={styles.content}>
          {/* Page heading */}
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.pageTitle}>Assigned PT&apos;S</h1>
              <p className={styles.pageSubtitle}>
                Monitor performance, engagement, and progress of all assigned Personal Trainers.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={`${styles.statCard} ${styles.statDefault}`}>
              <p className={styles.statLabel}>TOTAL PERSONNEL</p>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>{stats.total}</span>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.statGreen}`}>
              <p className={styles.statLabel}>HEALTHY STATUS</p>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>{stats.healthy}</span>
                <span className={styles.statSub}>Personnel Clear</span>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.statYellow}`}>
              <p className={styles.statLabel}>WARNINGS</p>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>{stats.warnings}</span>
                <span className={styles.statSub}>Intervention Required</span>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.statRed}`}>
              <p className={styles.statLabel}>CRITICAL ALERTS</p>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>{stats.critical}</span>
                <span className={styles.statSub}>Escalate Immediately</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            {loading && <p style={{ padding: "20px", textAlign: "center" }}>Loading trainers...</p>}
            {error && <p style={{ padding: "20px", textAlign: "center", color: "#ff6b6b" }}>{error}</p>}
            {!loading && !error && (
            <table className={styles.table}>
              <thead>
                <tr className={styles.thead}>
                  <th className={styles.th}>TRAINER PROFILE</th>
                  <th className={styles.th}>GYM / LOCATION</th>
                  <th className={styles.th}>TOTAL CLIENTS</th>
                  <th className={styles.th}>NEW CLIENTS THIS MONTH</th>
                  <th className={styles.th}>RETENTION %</th>
                  <th className={styles.th}>AVG RATING</th>
                  <th className={styles.th}>AI CONSULTATION</th>
                  <th className={styles.th}>STATUS</th>
                  <th className={styles.th}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.name} className={styles.trow}>
                    <td className={styles.td}>
                      <div className={styles.profileCell}>
                        <div className={`${styles.avatar} ${styles[`av_${t.status}`]}`}>
                          <Avatar src={t.img} name={t.name} size={38} className={styles.avatarImg} />
                        </div>
                        <div>
                          <p className={styles.trainerName}>{t.name}</p>
                          <p className={styles.trainerTier}>{t.tier}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.gymName}>{t.gym}</p>
                      <p className={styles.gymLoc}>{t.location}</p>
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      <span className={styles.clientNum}>{t.totalClients}</span>
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      -
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      -
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      -
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      -
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      <span className={`${styles.statusDot} ${styles[`dot_${t.status}`]}`} />
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      <div className={styles.menuWrap}>
                        <button
                          className={styles.kebabBtn}
                          aria-label="Actions"
                          onClick={() => toggleMenu(t.name)}
                        >
                          <span /><span /><span />
                        </button>
                        {openMenu === t.name && (
                          <div className={styles.dropdown}>
                            <button
                              className={styles.dropItem}
                              onClick={() => { setOpenMenu(null); router.push(`/direct-chat?trainer=${encodeURIComponent(t.name)}`); }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Chat
                            </button>
                            <button
                              className={styles.dropItem}
                              onClick={() => {
                                setOpenMenu(null);
                                router.push(`/pt-profile/${t.id}`);
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                              </svg>
                              View Profile
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && (
          <div className={styles.pagination}>
            <span className={styles.pageInfo}>Showing 1 to {filtered.length} of {stats.total} Personnel</span>
            <div className={styles.pageBtns}>
              <button className={styles.pageArrow} disabled>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={page === n ? styles.pageNumActive : styles.pageNum}
                  onClick={() => setPage(n)}
                >{n}</button>
              ))}
              <button className={styles.pageArrow}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
