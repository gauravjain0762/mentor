"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";

const GRID_Y = [40, 80, 120, 160, 200];

function generatePathFromData(scores) {
  if (!scores || scores.length === 0) return "M 0,190 L 600,190";

  const maxScore = 5;
  const minScore = 0;
  const stepX = 600 / (scores.length - 1 || 1);

  let path = "";
  scores.forEach((score, i) => {
    const x = i * stepX;
    const y = 210 - ((score - minScore) / (maxScore - minScore)) * 190;
    path += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
  });

  return path;
}

function Chart({ period, data, labels }) {
  if (!data || !data[period]) {
    return (
      <div className={styles.chartWrap}>
        <svg viewBox="0 0 600 210" preserveAspectRatio="none" className={styles.svg}>
          <text x="300" y="105" textAnchor="middle" fill="#666" fontSize="14">No data available</text>
        </svg>
      </div>
    );
  }

  const scores = data[period];
  const chartLabels = labels[period] || [];
  const line = generatePathFromData(scores);
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
        {chartLabels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("7D");
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({ "7D": [], "30D": [] });
  const [chartLabels, setChartLabels] = useState({ "7D": [], "30D": [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (period && !chartData[period].length) {
      fetchPerformanceData(period);
    }
  }, [period]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const data = await apiFetch("/api/mentor/dashboard/overview");
      setStats(data.data?.stats || {});
      setError("");

      await Promise.all([
        fetchPerformanceData("7D"),
        fetchPerformanceData("30D"),
      ]);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
      setStats({});
    } finally {
      setLoading(false);
    }
  }

  async function fetchPerformanceData(per) {
    try {
      const data = await apiFetch(`/api/mentor/dashboard/performance-trajectory?period=${per}`);
      const scores = data.data?.chartData?.map(d => d.score) || [];
      const labels = data.data?.labels || [];

      setChartData(prev => ({ ...prev, [per]: scores }));
      setChartLabels(prev => ({ ...prev, [per]: labels }));
    } catch (err) {
      console.log(`Performance trajectory for ${per} not available`);
    }
  }

  if (loading) return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.mainCol}>
        <TopBar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)", color: "#666" }}>Loading dashboard...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.mainCol}>
        <TopBar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)", color: "#ff6b6b" }}>{error}</div>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <Sidebar />

      <div className={styles.mainCol}>

      <TopBar />

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
              { label: "Total Assigned PTs", key: "totalAssignedPTs",  link: "/pt-dashboard" },
              { label: "Active PTs",          key: "activePTs", bar: true },
              { label: "At-Risk PTs",         key: "atRiskPTs"  },
              { label: "Clients Managed",     key: "clientsManaged"},
            ].map((s) => (
              <div
                key={s.label}
                className={`${styles.cellTop} ${s.link ? styles.cellClickable : ""}`}
                onClick={() => s.link && router.push(s.link)}
              >
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statValue}>{stats?.[s.key] || 0}</p>
                {s.bar && <div className={styles.underBar} />}
              </div>
            ))}
          </div>
          {/* Row 2 — 3 columns */}
          <div className={styles.row2}>
            {[
              { label: "Avg Feedback Score",       key: "avgFeedbackScore",   link: "/trainer-review" },
              { label: "Upcoming Check-ins",       key: "upcomingCheckIns"    },
              { label: "Monthly Operational Hours", key: "monthlyOperationalHours" },
            ].map((s) => (
              <div
                key={s.label}
                className={`${styles.cellBot} ${s.link ? styles.cellClickable : ""}`}
                onClick={() => s.link && router.push(s.link)}
              >
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statValue}>{s.key === "avgFeedbackScore" ? (stats?.[s.key] || 0).toFixed(1) : (stats?.[s.key] || 0).toLocaleString()}</p>
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
          <Chart period={period} data={chartData} labels={chartLabels} />
        </div>

      </div>

      </div>
    </div>
  );
}
