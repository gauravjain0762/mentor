"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";

const PT_LIST = ["Candidate Delta-4", "Operative Kael", "Asset 09", "Recruit J", "Julian Vance", "Alistair Sterling", "Evelyn Cross", "Marcus Thorne", "Danny Olive"];
const ACTIVITY_TYPES = ["Transcript Review", "Escalation Support", "Retention Audit", "Check-In"];

export default function AddLogPage() {
  const router = useRouter();

  const [form, setForm] = useState({ pt: "", date: "", activityType: "", hours: "", minutes: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function clearData() {
    setForm({ pt: "", date: "", activityType: "", hours: "", minutes: "", notes: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => router.push("/operational"), 1200);
  }

  const isValid = form.pt && form.date && form.activityType && (form.hours || form.minutes);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.rightSection}>
        <TopBar />

        <div className={styles.content}>

          {/* Back link */}
          <button className={styles.backLink} onClick={() => router.push("/operational")}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            BACK
          </button>

          {/* Centered card */}
          <div className={styles.cardWrap}>
            <div className={styles.card}>

              {submitted ? (
                <div className={styles.successMsg}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2"/>
                    <polyline points="7 12 10 15 17 9" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>Entry submitted. Redirecting…</p>
                </div>
              ) : (
                <>
                  <h2 className={styles.cardTitle}>New Log Entry</h2>
                  <p className={styles.cardSub}>Document specific operational interventions and mentor sessions.</p>

                  <form className={styles.form} onSubmit={handleSubmit}>

                    {/* Row 1 */}
                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label className={styles.label}>PT Directory</label>
                        <div className={styles.selectWrap}>
                          <select className={`${styles.select} ${styles.selectPadded}`} value={form.pt} onChange={(e) => set("pt", e.target.value)}>
                            <option value="">Select PT...</option>
                            {PT_LIST.map((p) => <option key={p}>{p}</option>)}
                          </select>
                          <div className={styles.selectIcon}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Execution Date</label>
                        <input
                          type="date"
                          className={styles.input}
                          value={form.date}
                          onChange={(e) => set("date", e.target.value)}
                          onClick={(e) => e.target.showPicker?.()}
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label className={styles.label}>Activity Type</label>
                        <div className={styles.selectWrap}>
                          <select className={`${styles.select} ${styles.selectPadded}`} value={form.activityType} onChange={(e) => set("activityType", e.target.value)}>
                            <option value="">Classification...</option>
                            {ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}
                          </select>
                          <div className={styles.selectIcon}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Session Duration</label>
                        <div className={styles.durationRow}>
                          <input
                            type="number"
                            min="0"
                            placeholder="Hrs"
                            className={`${styles.input} ${styles.durationInput}`}
                            value={form.hours}
                            onChange={(e) => set("hours", e.target.value)}
                          />
                          <input
                            type="number"
                            min="0"
                            max="59"
                            placeholder="Mins"
                            className={`${styles.input} ${styles.durationInput}`}
                            value={form.minutes}
                            onChange={(e) => set("minutes", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className={styles.field}>
                      <label className={styles.label}>Detailed Observations</label>
                      <textarea
                        className={styles.textarea}
                        rows={5}
                        placeholder="Document specific observations, technical discrepancies, or mentor feedback here..."
                        value={form.notes}
                        onChange={(e) => set("notes", e.target.value)}
                      />
                    </div>

                    {/* Buttons */}
                    <div className={styles.formActions}>
                      <button type="button" className={styles.clearBtn} onClick={clearData}>
                        CLEAR DATA
                      </button>
                      <button type="submit" className={styles.submitBtn}>
                        SUBMIT ENTRY
                      </button>
                    </div>

                  </form>
                </>
              )}

            </div>

            {/* Footer */}
            <p className={styles.footer}>
              SYSTEM V.4.2.0 &nbsp;·&nbsp; ENCRYPTION: AES-256 &nbsp;·&nbsp; NODE: LND-CORE-09
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
