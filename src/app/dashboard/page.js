"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import styles from "./page.module.css";

const Y = "rgba(248,227,150,";

const CHART = {
  "7D": {
    line: "M 0,185 C 70,183 110,178 150,168 C 200,155 240,118 295,62 C 340,20 390,14 450,12 C 510,10 560,10 600,10",
    labels: ["SEP 01", "SEP 08", "SEP 15", "SEP 22", "SEP 30"],
  },
  "30D": {
    line: "M 0,188 C 60,186 100,182 155,172 C 215,158 250,130 300,90 C 350,50 400,24 455,16 C 505,10 560,9 600,9",
    labels: ["SEP 01", "SEP 08", "SEP 15", "SEP 22", "SEP 30"],
  },
};

const GRID_Y = [40, 80, 120, 160, 200];

function Chart({ period }) {
  const { line, labels } = CHART[period];
  const fill = `${line} L 600,210 L 0,210 Z`;
  return (
    <div className={styles.chartWrap}>
      <svg viewBox="0 0 600 210" preserveAspectRatio="none" className={styles.svg}>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F8E396" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F8E396" stopOpacity="0.00" />
          </linearGradient>
        </defs>
        {GRID_Y.map((y) => (
          <line key={y} x1="0" y1={y} x2="600" y2={y}
            stroke="rgba(248,227,150,0.06)" strokeWidth="1" />
        ))}
        <path d={fill} fill="url(#g)" />
        <path d={line} fill="none" stroke="#F8E396" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
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
    <div className={styles.page}>
      <Sidebar />

      <div className={styles.mainCol}>

      {/* Top bar */}
      <header className={styles.topBar}>
        <button className={styles.bell} aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <button className={styles.logout} onClick={() => router.push("/")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <polyline points="16 17 21 12 16 7"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="12" x2="9" y2="12"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Logout
        </button>
      </header>

      <div className={styles.content}>

        {/* Heading */}
        <h1 className={styles.title}>MENTOR DASHBOARD</h1>
        <p className={styles.subtitle}>
          Empowering PT Success Through Guidance &amp; Performance Insights
        </p>

        {/* Stats — single connected block */}
        <div className={styles.statsWrap}>
          {/* Row 1 — 4 columns */}
          <div className={styles.row1}>
            {[
              { label: "Total Assigned PTs", value: "24",  link: "/pt-dashboard" },
              { label: "Active PTs",          value: "18", bar: true },
              { label: "At-Risk PTs",         value: "3"  },
              { label: "Clients Managed",     value: "482"},
            ].map((s) => (
              <div
                key={s.label}
                className={`${styles.cellTop} ${s.link ? styles.cellClickable : ""}`}
                onClick={() => s.link && router.push(s.link)}
              >
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statValue}>{s.value}</p>
                {s.bar && <div className={styles.underBar} />}
              </div>
            ))}
          </div>
          {/* Row 2 — 3 columns */}
          <div className={styles.row2}>
            {[
              { label: "Avg Feedback Score",       value: "4.8",   link: "/trainer-review" },
              { label: "Upcoming Check-ins",        value: "12"    },
              { label: "Monthly Operational Hours", value: "1,240" },
            ].map((s) => (
              <div
                key={s.label}
                className={`${styles.cellBot} ${s.link ? styles.cellClickable : ""}`}
                onClick={() => s.link && router.push(s.link)}
              >
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statValue}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHead}>
            <div>
              <p className={styles.chartTitle}>PERFORMANCE TRAJECTORY</p>
              <p className={styles.chartSub}>Growth &amp; feedback resonance analysis.</p>
            </div>
            <div className={styles.toggle}>
              {["7D", "30D"].map((p) => (
                <button
                  key={p}
                  className={period === p ? styles.toggleActive : styles.toggleBtn}
                  onClick={() => setPeriod(p)}
                >{p}</button>
              ))}
            </div>
          </div>
          <Chart period={period} />
        </div>

      </div>

      </div>
    </div>
  );
}
