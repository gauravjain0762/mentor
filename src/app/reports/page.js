"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";
import FeedbackSection from "./FeedbackSection";

const shortId = (id = "") => id.slice(-6).toUpperCase();
const prettyDate = (date) => {
  if (!date) return "—";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? "—" : parsedDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};
const prettyTime = (date) => {
  if (!date) return "";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase().replace(" ", "");
};
const sessionSlot = (row) => {
  if (row.slot || row.sessionSlot || row.slotTime) return row.slot || row.sessionSlot || row.slotTime;
  const start = prettyTime(row.booking?.timeSlot?.startTime);
  const end = prettyTime(row.booking?.timeSlot?.endTime);
  return start && end ? `${start} - ${end}` : "—";
};
const trainerName = (report) => report?.trainer?.name || report?.trainerName || "";
const customerName = (report) => report?.customer?.name || report?.customerName || "";
const reportTypeValue = (report) => report?.reportType || (report?.type === "TRAINER_REPORT" ? "CUSTOMER_REPORTED_TRAINER" : report?.type === "CUSTOMER_REPORT" ? "TRAINER_REPORTED_CUSTOMER" : "");
const reportedBy = (report) => reportTypeValue(report) === "CUSTOMER_REPORTED_TRAINER"
  ? `Customer — ${customerName(report) || "—"}`
  : `Trainer — ${trainerName(report) || "—"}`;
const titleCase = (value = "") => value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function ReportsPage() {
  const [tab, setTab] = useState("reports");
  const [status, setStatus] = useState("all");
  const [reportType, setReportType] = useState("all");
  const [category, setCategory] = useState("all");
  const [trainer, setTrainer] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [selectedCancelled, setSelectedCancelled] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);
  const [resolveError, setResolveError] = useState("");

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (status !== "all") params.set("status", status);
  const { data, error, isLoading, mutate: mutateReports } = useSWR(`/api/mentor/reports?${params}`, { keepPreviousData: true });
  const cancelledParams = new URLSearchParams({ page: String(page), pageSize: "10" });
  const { data: cancelledData, error: cancelledError, isLoading: cancelledLoading } = useSWR(`/api/cancelled-sessions/mentor/me?${cancelledParams}`, { keepPreviousData: true });
  const reports = data?.data?.reports || [];
  const pagination = data?.data?.pagination || {};
  const cancelledSessions = cancelledData?.data?.sessions || [];
  const cancelledPagination = cancelledData?.data?.pagination || {};

  const trainers = useMemo(() => [...new Set((tab === "reports" ? reports.map(trainerName) : cancelledSessions.map((item) => item.trainer?.name)).filter(Boolean))], [reports, cancelledSessions, tab]);
  const customers = useMemo(() => [...new Set((tab === "reports" ? reports.map(customerName) : cancelledSessions.map((item) => item.customer?.name)).filter(Boolean))], [reports, cancelledSessions, tab]);
  const categories = useMemo(() => [...new Set(reports.map((item) => item.reason).filter(Boolean))], [reports]);
  const filtered = reports.filter((item) =>
    (trainer === "all" || trainerName(item) === trainer) &&
    (customer === "all" || customerName(item) === customer) &&
    (category === "all" || item.reason === category)
  );
  const filteredCancelled = cancelledSessions.filter((item) =>
    (trainer === "all" || item.trainer?.name === trainer) &&
    (customer === "all" || item.customer?.name === customer)
  );

  async function handleResolve(reportId) {
    setResolvingId(reportId);
    setResolveError("");
    try {
      const report = reports.find((item) => item.id === reportId);
      const reportType = reportTypeValue(report);
      await apiFetch(`/api/mentor/all-reports/${reportId}/resolve`, {
        method: "PUT",
        body: JSON.stringify({ reportType }),
      });
      await mutateReports();
    } catch (updateError) {
      setResolveError(updateError.message || "Could not resolve this report.");
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <TopBar />
        <div className={styles.content}>
          <header className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Cancelled &amp; reports</h1>
            <p className={styles.pageSubtitle}>Manage and resolve trainer support requests</p>
          </header>

          <div className={styles.peopleFilters}>
            <label className={styles.filterField}><span>TRAINER</span><select value={trainer} onChange={(event) => setTrainer(event.target.value)}><option value="all">All trainers</option>{trainers.map((name) => <option key={name}>{name}</option>)}</select></label>
            <label className={styles.filterField}><span>CUSTOMER</span><select value={customer} onChange={(event) => setCustomer(event.target.value)}><option value="all">All customers</option>{customers.map((name) => <option key={name}>{name}</option>)}</select></label>
          </div>

          <section className={styles.statsRow} aria-label="Report summary">
            {[
              ["CANCELLED BY TRAINER", cancelledPagination.total ?? cancelledSessions.length, "Trainer cancellations", "⊗"],
              ["REPORTED SESSIONS", pagination.total ?? reports.length, "Matching reports", "ⓘ"],
            ].map(([label, value, caption, icon]) => <article className={styles.statCard} key={label}><span className={styles.statIcon}>{icon}</span><div><p className={styles.statLabel}>{label}</p><p className={styles.statValue}>{value}</p><span className={styles.statCaption}>{caption}</span></div></article>)}
          </section>

          <nav className={styles.tabs} aria-label="Cancelled and reports">
            <button className={tab === "cancelled" ? styles.activeTab : ""} onClick={() => { setTab("cancelled"); setPage(1); }}>Cancelled Sessions</button>
            <button className={tab === "reports" ? styles.activeTab : ""} onClick={() => { setTab("reports"); setPage(1); }}>Reports</button>
            <button className={tab === "feedback" ? styles.activeTab : ""} onClick={() => { setTab("feedback"); setPage(1); }}>Feedback</button>
          </nav>

          {tab === "feedback" ? <FeedbackSection /> : tab === "reports" ? <>
            {resolveError && <p className={styles.resolveError} role="alert">{resolveError}</p>}
            <div className={styles.tableFilters}>
              <label className={styles.filterField}><span>STATUS</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">All</option><option value="PENDING">Pending</option><option value="RESOLVED">Resolved</option><option value="REJECTED">Rejected</option></select></label>
              <label className={styles.filterField}><span>REPORT TYPE</span><select value={reportType} onChange={(event) => { setReportType(event.target.value); setPage(1); }}><option value="all">All</option><option value="CUSTOMER_REPORTED_TRAINER">Customer reported trainer</option><option value="TRAINER_REPORTED_CUSTOMER">Trainer reported customer</option></select></label>
              <label className={styles.filterField}><span>CATEGORY</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr>{["REPORT ID", "REPORTED BY", "CUSTOMER", "TRAINER", "REASON", "STATUS", "SESSION DATE", "REPORTED AT", "ACTION"].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
                <tbody>
                  {isLoading ? <tr><td colSpan={9} className={styles.empty}>Loading reports…</td></tr> : error ? <tr><td colSpan={9} className={styles.empty}>{error.message}</td></tr> : filtered.filter((row) => reportType === "all" || reportTypeValue(row) === reportType).length === 0 ? <tr><td colSpan={9} className={styles.empty}>No reports found</td></tr> : filtered.filter((row) => reportType === "all" || reportTypeValue(row) === reportType).map((row) => <tr key={row.id}>
                    <td className={styles.id}>{shortId(row.id)}</td><td>{row.reporterName || reportedBy(row)}</td><td>{customerName(row) || "—"}</td><td>{trainerName(row) || "—"}</td><td>{row.reason || "—"}</td>
                    <td><span className={`${styles.status} ${styles[`status${titleCase(row.status).replace(/\s/g, "")}`] || ""}`}>{titleCase(row.status)}</span></td>
                    <td>{prettyDate(row.sessionDate || row.booking?.timeSlot?.date || row.date)}</td><td>{prettyDate(row.createdAt || row.date)}</td>
                    <td><div className={styles.reportActions}><button className={styles.viewButton} title="View report" aria-label={`View report ${shortId(row.id)}`} onClick={() => setSelected(row)}><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg></button>{row.status !== "RESOLVED" && <button className={styles.resolveButton} onClick={() => handleResolve(row.id)} disabled={resolvingId === row.id}>{resolvingId === row.id ? "Saving…" : "Mark resolved"}</button>}</div></td>
                  </tr>)}
                </tbody>
              </table>
              <footer className={styles.pagination}><span>Showing page {page} of {pagination.totalPages || 1}</span><div><button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button><b>{page}</b><button disabled={page >= (pagination.totalPages || 1)} onClick={() => setPage((value) => value + 1)}>›</button></div></footer>
            </div>
          </> : <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr>{["BOOKING ID", "CUSTOMER", "TRAINER", "REASON", "SESSION DATE", "SLOT", "CANCELLED AT", "ACTION"].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
                <tbody>
                  {cancelledLoading ? <tr><td colSpan={8} className={styles.empty}>Loading cancelled sessions…</td></tr> : cancelledError ? <tr><td colSpan={8} className={styles.empty}>{cancelledError.message}</td></tr> : filteredCancelled.length === 0 ? <tr><td colSpan={8} className={styles.empty}>No cancelled sessions found</td></tr> : filteredCancelled.map((session) => <tr key={session.bookingId}>
                    <td className={styles.id}>{shortId(session.bookingId)}</td><td>{session.customer?.name || "—"}</td><td>{session.trainer?.name || "—"}</td><td>{session.reason || "—"}</td><td>{prettyDate(session.date)}</td><td>{session.slotTime || "—"}</td><td>{prettyDate(session.cancelledAt)}</td>
                    <td><button className={styles.viewButton} title="View cancelled session" aria-label={`View cancelled session ${shortId(session.bookingId)}`} onClick={() => setSelectedCancelled(session)}><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg></button></td>
                  </tr>)}
                </tbody>
              </table>
              <footer className={styles.pagination}><span>Showing page {page} of {cancelledPagination.totalPages || 1}</span><div><button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button><b>{page}</b><button disabled={page >= (cancelledPagination.totalPages || 1)} onClick={() => setPage((value) => value + 1)}>›</button></div></footer>
            </div>
          </>}
        </div>
      </main>
      {selected && <div className={styles.modalBackdrop} onClick={() => setSelected(null)}><section className={`${styles.modal} ${styles.reportModal}`} role="dialog" aria-modal="true" aria-labelledby="report-detail-title" onClick={(event) => event.stopPropagation()}>
        <header className={styles.feedbackModalHeader}><h2 id="report-detail-title">Reported Event</h2><button className={styles.feedbackCloseButton} onClick={() => setSelected(null)} aria-label="Close">×</button></header>
        <div className={styles.feedbackModalBody}>
          <div className={styles.feedbackPeopleGrid}>
            <section className={styles.feedbackDetailCard}><h3>TRAINER</h3><p><span>Name</span><strong>{trainerName(selected) || "—"}</strong></p><p><span>Email</span><strong>{selected.trainer?.email || selected.trainerEmail || "—"}</strong></p><p><span>Phone</span><strong>{selected.trainer?.phone || selected.trainerPhone || "—"}</strong></p></section>
            <section className={styles.feedbackDetailCard}><h3>CUSTOMER</h3><p><span>Name</span><strong>{customerName(selected) || "—"}</strong></p><p><span>Email</span><strong>{selected.customer?.email || selected.customerEmail || "—"}</strong></p><p><span>Phone</span><strong>{selected.customer?.phone || selected.customerPhone || "—"}</strong></p></section>
          </div>
          <section className={styles.feedbackDetailCard}><h3>REPORT DETAILS</h3><p><span>Reported By</span><strong>{reportedBy(selected)}</strong></p><p><span>Reason</span><strong>{selected.reason || "—"}</strong></p><p><span>Status</span><strong><span className={`${styles.status} ${styles[`status${titleCase(selected.status).replace(/\s/g, "")}`] || ""}`}>{titleCase(selected.status)}</span></strong></p><p><span>Session Date</span><strong>{prettyDate(selected.booking?.timeSlot?.date || selected.sessionDate || selected.date)}</strong></p><p><span>Session Time</span><strong>{sessionSlot(selected)}</strong></p><p><span>Reported At</span><strong>{prettyDate(selected.createdAt || selected.date)}</strong></p></section>
          <section className={styles.feedbackDetailCard}><h3>DESCRIPTION</h3><div className={styles.feedbackComment}>{selected.description || "No description provided."}</div></section>
        </div>
        <footer className={styles.reportModalFooter}><button onClick={() => setSelected(null)}>Close</button></footer>
      </section></div>}
      {selectedCancelled && <div className={styles.modalBackdrop} onClick={() => setSelectedCancelled(null)}><section className={`${styles.modal} ${styles.sessionModal}`} role="dialog" aria-modal="true" aria-labelledby="cancelled-session-title" onClick={(event) => event.stopPropagation()}><button className={styles.closeButton} onClick={() => setSelectedCancelled(null)} aria-label="Close">×</button><h2 id="cancelled-session-title">Cancelled Session Details</h2><div className={styles.sessionDetailGrid}><section className={styles.sessionDetailCard}><h3>CUSTOMER</h3><p><span>Name</span><strong>{selectedCancelled.customer?.name || "—"}</strong></p><p><span>Email</span><strong>{selectedCancelled.customer?.email || "—"}</strong></p><p><span>Phone</span><strong>{selectedCancelled.customer?.phone || "—"}</strong></p></section><section className={styles.sessionDetailCard}><h3>TRAINER</h3><p><span>Name</span><strong>{selectedCancelled.trainer?.name || "—"}</strong></p><p><span>Host Gym</span><strong>{selectedCancelled.trainer?.hostGymName || "—"}</strong></p><p><span>Gym Address</span><strong>{selectedCancelled.trainer?.hostGymAddress || "—"}</strong></p></section><section className={`${styles.sessionDetailCard} ${styles.sessionDetailWide}`}><h3>SESSION DETAILS</h3><p><span>Booking ID</span><strong>{selectedCancelled.bookingId || "—"}</strong></p><p><span>Session Date</span><strong>{prettyDate(selectedCancelled.date)}</strong></p><p><span>Session Time</span><strong>{selectedCancelled.slotTime || "—"}</strong></p><p><span>Cancelled At</span><strong>{prettyDate(selectedCancelled.cancelledAt)}{prettyTime(selectedCancelled.cancelledAt) ? `, ${prettyTime(selectedCancelled.cancelledAt)}` : ""}</strong></p><p><span>Reason</span><strong>{selectedCancelled.reason || "—"}</strong></p></section></div></section></div>}
    </div>
  );
}
