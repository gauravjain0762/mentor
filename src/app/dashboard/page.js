"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import styles from "./page.module.css";

const CHART_DATA = {
  "7D": {
    line: "M 0,170 C 80,168 130,158 190,140 C 250,122 270,96 310,68 C 350,40 385,22 430,15 C 475,9 548,8 600,8",
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  },
  "1M": {
    line: "M 0,160 C 60,158 100,150 160,136 C 220,122 248,100 285,74 C 322,48 362,28 412,18 C 462,10 535,8 600,8",
    labels: ["WK 1", "WK 2", "WK 3", "WK 4"],
  },
  "1Y": {
    line: "M 0,175 C 50,172 90,165 150,150 C 210,135 240,115 280,90 C 320,65 360,40 410,24 C 460,12 535,8 600,8",
    labels: ["JAN", "MAR", "MAY", "JUL", "SEP", "NOV"],
  },
};

function PerformanceChart({ period }) {
  const { line: linePath, labels } = CHART_DATA[period];
  const fillPath = `${linePath} L 600,200 L 0,200 Z`;

  return (
    <div className={styles.chartWrapper}>
      <svg viewBox="0 0 600 200" preserveAspectRatio="none" className={styles.chartSvg}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8e396" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f8e396" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="#f8e396" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className={styles.xAxis}>
        {labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("7D");

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.topBarActions}>
            <button className={styles.iconBtn} aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button className={styles.logoutBtn} onClick={() => router.push("/")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <h1 className={styles.pageTitle}>MENTOR DASHBOARD</h1>
          <p className={styles.pageSubtitle}>
            Empowering PT Success Through Guidance &amp; Performance Insights
          </p>

          <div className={styles.statsRow1}>
            {[
              { label: "Total Assigned PTs", value: "24" },
              { label: "Active PTs", value: "18", bar: true },
              { label: "At-Risk PTs", value: "3" },
              { label: "Clients Managed", value: "482" },
            ].map((s) => (
              <div key={s.label} className={styles.statCard}>
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statValue}>{s.value}</p>
                {s.bar && (
                  <div className={styles.statBar}>
                    <div className={styles.statBarFill} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.statsRow2}>
            {[
              { label: "Avg Feedback Score", value: "4.8" },
              { label: "Upcoming Check-Ins", value: "12" },
              { label: "Monthly Operational Hours", value: "1,240" },
            ].map((s) => (
              <div key={s.label} className={styles.statCard}>
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statValue}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <h2 className={styles.chartTitle}>PERFORMANCE TRAJECTORY</h2>
                <p className={styles.chartSubtitle}>Growth &amp; feedback resonance analysis.</p>
              </div>
              <div className={styles.periodToggle}>
                {["7D", "1M", "1Y"].map((p) => (
                  <button
                    key={p}
                    className={period === p ? styles.periodBtnActive : styles.periodBtn}
                    onClick={() => setPeriod(p)}
                  >{p}</button>
                ))}
              </div>
            </div>
            <PerformanceChart period={period} />
          </div>
        </div>
      </main>
    </div>
  );
}
