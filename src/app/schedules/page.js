"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import RightAlerts from "@/components/RightAlerts";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";

const STATUS_COLORS = {
  scheduled: { bg: "#1a3a4a", text: "#4db8ff" },
  confirmed: { bg: "#1a3a2a", text: "#4dff9d" },
  completed: { bg: "#2a2a2a", text: "#888" },
  cancelled: { bg: "#3a1a1a", text: "#ff6b6b" },
  rescheduled: { bg: "#3a3a1a", text: "#ffd966" },
};

const ALERT_COLORS = {
  no_confirmation: { bg: "#3a2a1a", text: "#ff9d4d", urgency: "high" },
  client_cancellation: { bg: "#3a1a1a", text: "#ff6b6b", urgency: "medium" },
  no_show: { bg: "#3a1a1a", text: "#ff6b6b", urgency: "high" },
  reschedule_request: { bg: "#2a3a1a", text: "#ffd966", urgency: "medium" },
  schedule_conflict: { bg: "#3a1a2a", text: "#ff6b9d", urgency: "high" },
};

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertSummary, setAlertSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAllData();
  }, [currentMonth]);

  async function fetchAllData() {
    try {
      setLoading(true);
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split('T')[0];

      // Fetch schedules (optional - backend has schema mismatch)
      try {
        const schedData = await apiFetch(`/api/mentor/schedules/range?startDate=${startDate}&endDate=${endDate}`);
        setSchedules(schedData.data?.schedulesByDate || {});
      } catch (e) {
        console.log("Schedules endpoint not available - backend needs schema fix");
        setSchedules({});
      }

      // Fetch trainers (required)
      const trainData = await apiFetch("/api/mentor/assigned-pts?limit=10");
      setTrainers(trainData.data?.pts || []);

      // Fetch alerts (optional)
      try {
        const alertData = await apiFetch("/api/mentor/schedules/alerts?limit=50");
        setAlerts(alertData.data?.alerts || []);
      } catch (e) {
        console.log("Alerts endpoint not available");
        setAlerts([]);
      }

      // Fetch alert summary (optional)
      try {
        const summaryData = await apiFetch("/api/mentor/schedules/alerts/summary");
        setAlertSummary(summaryData.data?.summary || {});
      } catch (e) {
        console.log("Alert summary endpoint not available");
        setAlertSummary({});
      }

      // Fetch stats (optional)
      try {
        const statsData = await apiFetch("/api/mentor/schedules/stats?period=month");
        setStats(statsData.data?.stats || {});
      } catch (e) {
        console.log("Stats endpoint not available");
        setStats({});
      }

      setError("");
    } catch (err) {
      setError(err.message || "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  }

  async function handleAcknowledgeAlert(alertId) {
    try {
      await apiFetch(`/api/mentor/schedules/alerts/${alertId}`, {
        method: "PUT",
        body: JSON.stringify({ resolved: true, action: "acknowledged" }),
      });
      fetchAllData();
    } catch (err) {
      console.error("Failed to acknowledge alert:", err);
    }
  }

  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function getSchedulesForDate(dateStr) {
    return Object.entries(schedules)
      .filter(([date]) => date === dateStr)
      .flatMap(([, schs]) => schs)
      .filter(s => statusFilter === "all" || s.status === statusFilter);
  }

  function prevMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  }

  function nextMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  }

  if (loading) return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.rightSection}>
        <TopBar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)", color: "#666" }}>Loading schedules...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.rightSection}>
        <TopBar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)", color: "#ff6b6b" }}>{error}</div>
      </div>
    </div>
  );

  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.rightSection}>
        <TopBar />

        <div className={styles.body}>

      {/* Schedule-specific panels */}
      <aside className={styles.panels}>
        {/* Status Filter */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>STATUS FILTER</p>
          {["all", "scheduled", "confirmed", "completed", "cancelled"].map((status) => (
            <label key={status} className={`${styles.filterRow} ${statusFilter !== status ? styles.filterDim : ""}`} onClick={() => setStatusFilter(status)}>
              <span className={`${styles.checkbox} ${statusFilter === status ? styles.checkboxActive : ""}`}>
                {statusFilter === status && (
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5,5 4,7.5 8.5,2" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={styles.filterLabel}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </label>
          ))}
        </div>

        {/* Alerts Summary */}
        {alertSummary && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>ALERTS SUMMARY</p>
          <div style={{ fontSize: 12, color: "#aaa", lineHeight: "1.8" }}>
            <p>🔴 High: {alertSummary.byUrgency?.high || 0}</p>
            <p>🟡 Medium: {alertSummary.byUrgency?.medium || 0}</p>
            <p>🟢 Low: {alertSummary.byUrgency?.low || 0}</p>
            <p style={{ marginTop: 10, color: "#666" }}>Total: {alertSummary.total || 0}</p>
          </div>
        </div>
        )}

        {/* Trainers List */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>ASSIGNED PTS</p>
          {trainers.length === 0 ? (
            <p style={{ fontSize: 12, color: "#666" }}>No trainers assigned</p>
          ) : (
            trainers.slice(0, 6).map((t) => (
              <div key={t.id} className={styles.trainerRow}>
                <div className={styles.memberWrap}>
                  <Image src={t.avatar || "https://i.pravatar.cc/150?img=11"} alt={t.name} width={34} height={34} unoptimized className={styles.memberAvatar} />
                </div>
                <div>
                  <p className={styles.memberName}>{t.name}</p>
                  <p className={styles.memberSub}>{t.experience} yrs · ⭐ {t.rating}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {stats && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>STATS THIS MONTH</p>
          <div style={{ fontSize: 11, color: "#aaa", lineHeight: "2" }}>
            <p>Total: {stats.totalSchedules || 0}</p>
            <p>Confirmed: {stats.confirmedSchedules || 0}</p>
            <p>Completed: {stats.completedSessions || 0}</p>
            <p>No-show: {stats.noShowRate || 0}%</p>
          </div>
        </div>
        )}
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.calHeader}>
            <h2 className={styles.monthTitle}>{monthName}</h2>
            <div className={styles.navBtns}>
              <button className={styles.navBtn} onClick={prevMonth} aria-label="Previous">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className={styles.navBtn} onClick={nextMonth} aria-label="Next">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.calendar}>
            <div className={styles.dayHeaders}>
              {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d) => (
                <div key={d} className={styles.dayHeader}>{d}</div>
              ))}
            </div>
            <div className={styles.week}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className={`${styles.cell} ${styles.cellOuter}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const daySchedules = getSchedulesForDate(dateStr);
                const isToday = isCurrentMonth && day === today.getDate();
                return (
                  <div key={day} className={`${styles.cell} ${isToday ? styles.cellToday : ""}`}>
                    <div className={styles.cellTop}>
                      <span className={`${styles.dayNum} ${isToday ? styles.dayNumToday : ""}`}>{day}</span>
                      {isToday && <span className={styles.todayDot} />}
                    </div>
                    <div className={styles.events}>
                      {daySchedules.slice(0, 2).map((sch) => (
                        <div key={sch.id} className={styles.event} style={{ background: STATUS_COLORS[sch.status].bg, color: STATUS_COLORS[sch.status].text, fontSize: "10px" }}>
                          <span className={styles.evTitle}>{sch.ptName}</span>
                          <span className={styles.evSub}>{sch.startTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerts Section */}
          {alerts.length > 0 && (
          <div className={styles.tasksSection}>
            <div className={styles.tasksHeader}>
              <h2 className={styles.tasksTitle}>Active Alerts</h2>
              <span className={styles.tasksBadge}>{alerts.filter(a => !a.resolved).length} UNRESOLVED</span>
            </div>
            <div className={styles.taskGrid}>
              {alerts.filter(a => !a.resolved).slice(0, 6).map((alert) => (
                <div key={alert.id} className={styles.taskCard} style={{ background: ALERT_COLORS[alert.type]?.bg || "#2a2a2a" }}>
                  <div className={styles.taskTop}>
                    <span className={styles.taskTime} style={{ color: ALERT_COLORS[alert.type]?.text || "#aaa" }}>🔔 {alert.type.replace(/_/g, " ").toUpperCase()}</span>
                    <span className={`${styles.taskTag} ${styles[`tag_${alert.urgency}`]}`} style={{ color: ALERT_COLORS[alert.type]?.text || "#aaa" }}>{alert.urgency.toUpperCase()}</span>
                  </div>
                  <p className={styles.taskTitle} style={{ color: "#fff" }}>{alert.message}</p>
                  <button onClick={() => handleAcknowledgeAlert(alert.id)} style={{ marginTop: 10, padding: "6px 12px", background: ALERT_COLORS[alert.type]?.text, color: "#111", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                    ACKNOWLEDGE
                  </button>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </main>

      <RightAlerts />
        </div> {/* body */}
      </div> {/* rightSection */}
    </div>
  );
}
