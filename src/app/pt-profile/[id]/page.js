"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";

export default function PTProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [pt, setPt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPTDetails();
  }, [params.id]);

  async function fetchPTDetails() {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/mentor/assigned-pts/${params.id}`);
      setPt(data.data?.pt || null);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load PT details");
      setPt(null);
    } finally {
      setLoading(false);
    }
  }

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
              <Image
                src={pt.avatar || "https://i.pravatar.cc/150?img=11"}
                alt={pt.name}
                width={80}
                height={80}
                unoptimized
                className={styles.avatar}
              />
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
              <p className={styles.statLabel}>EXPERIENCE</p>
              <span className={styles.statValue}>{pt.experience} years</span>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>RATING</p>
              <span className={styles.statValue}>⭐ {pt.rating}/5</span>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>ACTIVE CLIENTS</p>
              <span className={styles.statValue}>{pt.activeClients}</span>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>TOTAL CLIENTS</p>
              <span className={styles.statValue}>{pt.totalClients}</span>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>JOIN DATE</p>
              <span className={styles.statValue}>{new Date(pt.joinDate).toLocaleDateString()}</span>
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
