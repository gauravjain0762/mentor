"use client";

import { useState } from "react";
import useSWR from "swr";
import styles from "./page.module.css";

const personName = (person) => person ? [person.firstName, person.lastName].filter(Boolean).join(" ") || person.name || "—" : "—";
const prettyDate = (date) => date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—";
const prettyTime = (date) => date ? new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase().replace(" ", "") : "";

export default function FeedbackSection() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const params = new URLSearchParams({ page: String(page), pageSize: "10" });
  const { data, error, isLoading } = useSWR(`/api/session-reviews/mentor/me?${params}`, { keepPreviousData: true });
  const reviews = data?.data?.reviews || [];
  const pagination = data?.data?.pagination || { total: 0, page: 1, pageSize: 10, totalPages: 1 };
  const start = reviews.length ? (pagination.page - 1) * pagination.pageSize + 1 : 0;
  const end = (pagination.page - 1) * pagination.pageSize + reviews.length;

  return <>
    <div className={`${styles.tableWrap} ${styles.feedbackTableWrap}`}>
      <table className={`${styles.table} ${styles.feedbackTable}`}>
        <thead><tr>{["CUSTOMER", "TRAINER", "RATING", "SESSION DATE", "SESSION TIME", "REVIEWED AT", "ACTION"].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
        <tbody>
          {isLoading ? <tr><td colSpan={7} className={styles.empty}>Loading feedback…</td></tr> : error ? <tr><td colSpan={7} className={styles.empty}>{error.message}</td></tr> : reviews.length === 0 ? <tr><td colSpan={7} className={styles.empty}>No feedback found</td></tr> : reviews.map((review) => {
            const slot = review.booking?.timeSlot;
            return <tr key={review.id}>
              <td>{personName(review.customer)}</td><td>{personName(review.trainer)}</td>
              <td><span className={styles.rating}><span aria-hidden="true">★</span> {review.rating} / 5</span></td>
              <td>{prettyDate(slot?.date)}</td><td>{slot?.startTime && slot?.endTime ? `${prettyTime(slot.startTime)} - ${prettyTime(slot.endTime)}` : "—"}</td><td>{prettyDate(review.createdAt)}</td>
              <td><button className={styles.viewButton} title="View feedback" aria-label={`View feedback from ${personName(review.customer)}`} onClick={() => setSelected(review)}><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg></button></td>
            </tr>;
          })}
        </tbody>
      </table>
      <footer className={styles.pagination}><span>Showing {start}-{end} of {pagination.total}</span><div><button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button><b>{page}</b><button disabled={page >= (pagination.totalPages || 1)} onClick={() => setPage((value) => value + 1)}>›</button></div></footer>
    </div>
    {selected && <div className={styles.modalBackdrop} onClick={() => setSelected(null)}><section className={`${styles.modal} ${styles.feedbackModal}`} role="dialog" aria-modal="true" aria-labelledby="feedback-detail-title" onClick={(event) => event.stopPropagation()}>
      <header className={styles.feedbackModalHeader}><h2 id="feedback-detail-title">Feedback Details</h2><button className={styles.feedbackCloseButton} onClick={() => setSelected(null)} aria-label="Close">×</button></header>
      <div className={styles.feedbackModalBody}>
        <div className={styles.feedbackPeopleGrid}>
          <section className={styles.feedbackDetailCard}><h3>TRAINER</h3><p><span>Name</span><strong>{personName(selected.trainer)}</strong></p><p><span>Email</span><strong>{selected.trainer?.email || "—"}</strong></p><p><span>Phone</span><strong>{selected.trainer?.phone || "—"}</strong></p><p><span>Host Gym</span><strong>{selected.trainer?.hostGymName || selected.trainer?.gym?.name || "—"}</strong></p><p><span>Gym Address</span><strong>{selected.trainer?.hostGymAddress || selected.trainer?.gym?.address || "—"}</strong></p></section>
          <section className={styles.feedbackDetailCard}><h3>CUSTOMER</h3><p><span>Name</span><strong>{personName(selected.customer)}</strong></p><p><span>Email</span><strong>{selected.customer?.email || "—"}</strong></p><p><span>Phone</span><strong>{selected.customer?.phone || "—"}</strong></p></section>
        </div>
        <section className={styles.feedbackDetailCard}><h3>REVIEW DETAILS</h3><p><span>Review ID</span><strong>{selected.id || "—"}</strong></p><p><span>Booking ID</span><strong>{selected.bookingId || selected.booking?.id || "—"}</strong></p><p><span>Rating</span><strong>{selected.rating} / 5</strong></p><p><span>Session Date</span><strong>{prettyDate(selected.booking?.timeSlot?.date)}</strong></p><p><span>Session Time</span><strong>{selected.booking?.timeSlot?.startTime && selected.booking?.timeSlot?.endTime ? `${prettyTime(selected.booking.timeSlot.startTime)} - ${prettyTime(selected.booking.timeSlot.endTime)}` : "—"}</strong></p><p><span>Submitted At</span><strong>{prettyDate(selected.createdAt)}</strong></p><p><span>Updated At</span><strong>{prettyDate(selected.updatedAt)}</strong></p></section>
        <section className={styles.feedbackDetailCard}><h3>COMMENT</h3><div className={styles.feedbackComment}>{selected.comment || "No comment provided."}</div></section>
      </div>
    </section></div>}
  </>;
}
