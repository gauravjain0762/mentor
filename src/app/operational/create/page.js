"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import styles from "./page.module.css";

export default function CreateLogPage() {
  const router = useRouter();
  const [pt,       setPt]       = useState("");
  const [date,     setDate]     = useState("");
  const [activity, setActivity] = useState("");
  const [hrs,      setHrs]      = useState("");
  const [mins,     setMins]     = useState("");
  const [notes,    setNotes]    = useState("");

  function handleClear() {
    setPt(""); setDate(""); setActivity(""); setHrs(""); setMins(""); setNotes("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    router.push("/operational");
  }

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <h2 className={styles.topTitle}>Log Operational Activity</h2>
          <div className={styles.topRight}>
            <button className={styles.iconBtn} aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button className={styles.iconBtn} aria-label="Settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <div className={styles.userChip}>
              <div className={styles.userAvatar}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#f8e396" strokeWidth="2"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#f8e396" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className={styles.userName}>Admin_Alpha</span>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {/* Back link */}
          <button className={styles.backLink} onClick={() => router.push("/operational")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Activity Log
          </button>

          {/* Form card */}
          <div className={styles.card}>
            <h1 className={styles.cardTitle}>New Log Entry</h1>
            <p className={styles.cardSubtitle}>Document specific operational interventions and mentor sessions.</p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row2}>
                {/* PT Directory */}
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>PT Directory</label>
                  <select
                    className={styles.select}
                    value={pt}
                    onChange={(e) => setPt(e.target.value)}
                  >
                    <option value="">Select PT...</option>
                    <option value="candidate-delta4">Candidate Delta-4</option>
                    <option value="operative-kael">Operative Kael</option>
                    <option value="asset-09">Asset 09</option>
                    <option value="recruit-j">Recruit J</option>
                  </select>
                </div>

                {/* Execution Date */}
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Execution Date</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="dd-mm-yyyy"
                  />
                </div>
              </div>

              <div className={styles.row2}>
                {/* Activity Type */}
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Activity Type</label>
                  <div className={styles.selectWrap}>
                    <select
                      className={`${styles.select} ${styles.selectWithIcon}`}
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                    >
                      <option value="">Classification...</option>
                      <option value="transcript">Transcript Review</option>
                      <option value="escalation">Escalation Support</option>
                      <option value="retention">Retention Audit</option>
                      <option value="checkin">Check-In</option>
                    </select>
                    <span className={styles.selectIconRight}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6h16M4 12h16M4 18h7" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Session Duration */}
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Session Duration</label>
                  <div className={styles.durationRow}>
                    <input
                      className={styles.input}
                      type="number"
                      min="0"
                      placeholder="Hrs"
                      value={hrs}
                      onChange={(e) => setHrs(e.target.value)}
                    />
                    <input
                      className={styles.input}
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Mins"
                      value={mins}
                      onChange={(e) => setMins(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Validation status */}
              <div className={styles.validationRow}>
                <span className={styles.validationDot} />
                <span className={styles.validationText}>Awaiting Entry Validation</span>
              </div>

              {/* Detailed Observations */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Detailed Observations</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Document specific observations, technical discrepancies, or mentor feedback here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                />
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button type="button" className={styles.clearBtn} onClick={handleClear}>
                  CLEAR DATA
                </button>
                <button type="submit" className={styles.submitBtn}>
                  SUBMIT ENTRY
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className={styles.footer}>
            SYSTEM V.4.2.0 &nbsp;•&nbsp; ENCRYPTION: AES-256 &nbsp;•&nbsp; NODE: LND-CORE-09
          </p>
        </div>
      </main>
    </div>
  );
}
