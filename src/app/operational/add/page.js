"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";

const ACTIVITY_TYPES = [
  { value: "TRANSCRIPT_REVIEW", label: "Transcript Review" },
  { value: "ESCALATION_SUPPORT", label: "Escalation Support" },
  { value: "RETENTION_AUDIT", label: "Retention Audit" },
  { value: "CHECK_IN", label: "Check-In" },
];

// ISO (yyyy-mm-dd, from the native date input's .value) <-> our own mm/dd/yyyy display text.
// Kept independent of the browser/OS locale, which is what native <input type="date"> otherwise follows.
function isoToDisplay(iso) {
  const parts = (iso || "").split("-");
  if (parts.length !== 3) return "";
  const [y, m, d] = parts;
  return `${m}/${d}/${y}`;
}

function displayToIso(display) {
  const match = (display || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return "";
  const [, mm, dd, yyyy] = match;
  const month = Number(mm), day = Number(dd);
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

export default function AddLogPage() {
  const router = useRouter();

  const { data: ptsData, isLoading: ptsLoading } = useSWR("/api/mentor/assigned-pts?limit=100");
  const pts = ptsData?.data?.pts || [];

  const [form, setForm] = useState({ pt: "", date: "", activityType: "", hours: "", minutes: "", notes: "" });
  const [dateText, setDateText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dateInputRef = useRef(null);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function clearData() {
    setForm({ pt: "", date: "", activityType: "", hours: "", minutes: "", notes: "" });
    setDateText("");
    setError("");
  }

  function handleDateTextChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8); // MMDDYYYY
    let formatted = digits;
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setDateText(formatted);
    set("date", displayToIso(formatted));
  }

  function handleNativeDateChange(e) {
    set("date", e.target.value);
    setDateText(isoToDisplay(e.target.value));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiFetch("/api/mentor/operational-logs", {
        method: "POST",
        body: JSON.stringify({
          ptId: form.pt,
          date: form.date,
          activityType: form.activityType,
          hours: Number(form.hours) || 0,
          minutes: Number(form.minutes) || 0,
          notes: form.notes,
        }),
      });
      setSubmitted(true);
      setTimeout(() => router.push("/operational"), 1200);
    } catch (err) {
      setError(err.message || "Failed to submit log entry");
    } finally {
      setSubmitting(false);
    }
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
                            <option value="">{ptsLoading ? "Loading PTs..." : "Select PT..."}</option>
                            {pts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
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
                        <div className={styles.selectWrap}>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="mm/dd/yyyy"
                            maxLength={10}
                            className={`${styles.input} ${styles.selectPadded}`}
                            value={dateText}
                            onChange={handleDateTextChange}
                          />
                          <button
                            type="button"
                            className={styles.dateIconBtn}
                            aria-label="Open calendar"
                            onClick={() => dateInputRef.current?.showPicker?.()}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </button>
                          <input
                            ref={dateInputRef}
                            type="date"
                            value={form.date}
                            onChange={handleNativeDateChange}
                            tabIndex={-1}
                            aria-hidden="true"
                            className={styles.hiddenDateInput}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label className={styles.label}>Activity Type</label>
                        <div className={styles.selectWrap}>
                          <select className={`${styles.select} ${styles.selectPadded}`} value={form.activityType} onChange={(e) => set("activityType", e.target.value)}>
                            <option value="">Classification...</option>
                            {ACTIVITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
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

                    {error && (
                      <p style={{ color: "#ff6b6b", fontSize: "11px", fontWeight: 600, margin: "-6px 0 0" }}>{error}</p>
                    )}

                    {/* Buttons */}
                    <div className={styles.formActions}>
                      <button type="button" className={styles.clearBtn} onClick={clearData}>
                        CLEAR DATA
                      </button>
                      <button type="submit" className={styles.submitBtn} disabled={!isValid || submitting} style={!isValid || submitting ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
                        {submitting ? "SUBMITTING..." : "SUBMIT ENTRY"}
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
