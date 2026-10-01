"use client";

import useSWR from "swr";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Avatar from "@/components/Avatar";
import styles from "./page.module.css";

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "--";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
}

export default function PTProfilePage() {
  const router = useRouter();
  const params = useParams();

  const { data, isLoading: loading, error: fetchErr } = useSWR(`/api/mentor/assigned-pts/${params.id}`);
  const pt = data?.data?.pt || null;
  const error = fetchErr?.message || "";

  if (loading) return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <TopBar />
        <div className={styles.contentWithLoader}>
          <div className={styles.loaderOverlay}>
            <div className={styles.spinner}></div>
            <p className={styles.loaderText}>Loading PT Profile...</p>
          </div>
        </div>
      </main>
    </div>
  );
  if (error) return <div className={styles.layout}><Sidebar /><main className={styles.main}><TopBar /><div className={styles.error}>{error}</div></main></div>;
  if (!pt) return <div className={styles.layout}><Sidebar /><main className={styles.main}><TopBar /><div className={styles.error}>PT not found</div></main></div>;

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <TopBar />
        <div className={styles.content}>

          {/* Back button */}
          <button className={styles.backBtn} onClick={() => router.back()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.profileTop}>
              <Avatar src={pt.avatar} name={pt.name} size={80} className={styles.avatar} />
              <div className={styles.headerInfo}>
                <h1 className={styles.title}>{pt.name}</h1>
                <p className={styles.subtitle}>{pt.specialization}</p>
                <p className={styles.cert}>{pt.certification}</p>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>TOTAL CLIENTS</p>
              <span className={styles.statValue}>{pt.totalClients}</span>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>JOIN DATE</p>
              <span className={styles.statValue}>{formatDate(pt.joinDate)}</span>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>STATUS</p>
              <span className={`${styles.statValue} ${styles[pt.status]}`}>
                {pt.status.charAt(0).toUpperCase() + pt.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <p className={styles.infoValue}>{pt.email}</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone</span>
                <p className={styles.infoValue}>{pt.phone}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
            <button className={styles.chatBtn} onClick={() => router.push(`/direct-chat?trainer=${encodeURIComponent(pt.name)}`)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Send Message
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
