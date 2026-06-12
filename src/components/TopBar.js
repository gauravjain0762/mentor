"use client";

import { useRouter } from "next/navigation";
import styles from "./TopBar.module.css";

export default function TopBar() {
  const router = useRouter();
  return (
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
  );
}
