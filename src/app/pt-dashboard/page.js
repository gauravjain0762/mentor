"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";

const TRAINERS = [
  {
    name: "Julian Vance",
    tier: "Elite Tier Trainer",
    gym: "Nexus Central Hub",
    location: "London, UK",
    initials: "JV",
    img: "https://i.pravatar.cc/150?img=11",
    activeClients: 42,
    newClients: 5,
    retention: 78,
    rating: 4.2,
    aiScore: 62,
    status: "warning",
  },
  {
    name: "Alistair Sterling",
    tier: "Elite Tier Trainer",
    gym: "Nexus South Hub",
    location: "London, UK",
    initials: "AS",
    img: "https://i.pravatar.cc/150?img=12",
    activeClients: 38,
    newClients: 4,
    retention: 82,
    rating: 4.5,
    aiScore: 78,
    status: "healthy",
  },
  {
    name: "Evelyn Cross",
    tier: "Pro Tier Trainer",
    gym: "Vanguard East",
    location: "Manchester, UK",
    initials: "EC",
    img: "https://i.pravatar.cc/150?img=5",
    activeClients: 25,
    newClients: 2,
    retention: 65,
    rating: 3.8,
    aiScore: 52,
    status: "critical",
  },
  {
    name: "Marcus Thorne",
    tier: "Elite Tier Trainer",
    gym: "Obsidian West",
    location: "London, UK",
    initials: "MT",
    img: "https://i.pravatar.cc/150?img=15",
    activeClients: 42,
    newClients: 6,
    retention: 88,
    rating: 4.9,
    aiScore: 91,
    status: "healthy",
  },
  {
    name: "Danny Olive",
    tier: "Elite Tier Trainer",
    gym: "Nexus Central Hub",
    location: "London, UK",
    initials: "DO",
    img: "https://i.pravatar.cc/150?img=17",
    activeClients: 42,
    newClients: 5,
    retention: 78,
    rating: 4.2,
    aiScore: 62,
    status: "warning",
  },
];

function RetentionBar({ pct }) {
  const color = pct >= 85 ? "#22c55e" : pct >= 75 ? "#f8e396" : pct >= 65 ? "#ffaa44" : "#ff6b6b";
  return (
    <div className={styles.retBar}>
      <div className={styles.retFill} style={{ width: `${pct}%`, background: color }} />
      <span className={styles.retLabel} style={{ color }}>{pct}%</span>
    </div>
  );
}

function Stars({ rating }) {
  return (
    <div className={styles.stars}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="#f8e396">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
      <span className={styles.ratingVal}>{rating}</span>
    </div>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 85 ? "#22c55e" : score >= 70 ? "#f8e396" : score >= 55 ? "#ffaa44" : "#ff6b6b";
  const bg    = score >= 85 ? "#0d2a1a" : score >= 70 ? "#2a2400" : score >= 55 ? "#2a1600" : "#2a0a0a";
  return (
    <div className={styles.scoreBadge} style={{ background: bg, borderColor: color }}>
      <span className={styles.scoreLabel} style={{ color }}>Score:</span>
      <span className={styles.scoreVal} style={{ color }}>{score}</span>
    </div>
  );
}

export default function PTDashboardPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);

  function toggleMenu(name) {
    setOpenMenu((prev) => (prev === name ? null : name));
  }

  const filtered = TRAINERS;

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
            <div className={styles.headActions}>
              {/* <button className={styles.onboardBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                ONBOARD NEW PT
              </button> */}
              <button className={styles.filterBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                FILTERS
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={`${styles.statCard} ${styles.statDefault}`}>
              <p className={styles.statLabel}>TOTAL PERSONNEL</p>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>142</span>
                <span className={styles.statDelta}>+12% vs LY</span>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.statGreen}`}>
              <p className={styles.statLabel}>HEALTHY STATUS</p>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>128</span>
                <span className={styles.statSub}>Personnel Clear</span>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.statYellow}`}>
              <p className={styles.statLabel}>WARNINGS</p>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>9</span>
                <span className={styles.statSub}>Intervention Required</span>
              </div>
            </div>
            <div className={`${styles.statCard} ${styles.statRed}`}>
              <p className={styles.statLabel}>CRITICAL ALERTS</p>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>5</span>
                <span className={styles.statSub}>Escalate Immediately</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.thead}>
                  <th className={styles.th}>TRAINER PROFILE</th>
                  <th className={styles.th}>GYM / LOCATION</th>
                  <th className={styles.th}>ACTIVE CLIENTS</th>
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
                          <Image src={t.img} alt={t.name} width={38} height={38} unoptimized className={styles.avatarImg} />
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
                      <span className={styles.clientNum}>{t.activeClients}</span>
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      <span className={styles.newClient}>+{t.newClients}</span>
                    </td>
                    <td className={styles.td}>
                      <RetentionBar pct={t.retention} />
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      <Stars rating={t.rating} />
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      <ScoreBadge score={t.aiScore} />
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
                            <button className={styles.dropItem} onClick={() => setOpenMenu(null)}>
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
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <span className={styles.pageInfo}>Showing 1 to {filtered.length} of 142 Personnel</span>
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
        </div>
      </main>
    </div>
  );
}
