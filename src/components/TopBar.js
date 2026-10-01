"use client";

import { useRouter } from "next/navigation";
import styles from "./TopBar.module.css";
import { clearMentorSession } from "@/lib/api";

export default function TopBar() {
  const router = useRouter();
  return (
    <header className={styles.topBar}>
      <button className={styles.logout} onClick={() => { clearMentorSession(); router.replace("/"); }}>
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
