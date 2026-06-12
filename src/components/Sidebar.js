"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./Sidebar.module.css";

const NAV = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/pt-dashboard",
    label: "Assigned PT's ",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/schedules",
    label: "Schedules",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    href: "/operational",
    label: "Operational Log",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <polyline points="12,7 12,12 15,15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>

      {/* Toggle button */}
      <button
        className={styles.toggleBtn}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          {collapsed
            ? <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            : <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          }
        </svg>
      </button>

      {/* Logo */}
      <a href="/dashboard" className={styles.logoLink}>
        <Image
          src="https://res.cloudinary.com/dbazlbkfj/image/upload/v1771390209/Layer_x0020_1_p5f6fs.png"
          alt="UPT"
          width={collapsed ? 38 : 140}
          height={collapsed ? 38 : 44}
          unoptimized
          className={styles.logoImg}
        />
      </a>

      {/* Divider */}
      <div className={styles.divider} />

      {/* User */}
      <div className={styles.userRow}>
        <div className={styles.avatar}>
          <Image
            src="https://i.pravatar.cc/150?img=8"
            alt="Executive Mentor"
            width={42}
            height={42}
            unoptimized
            className={styles.avatarImg}
          />
        </div>
        {!collapsed && (
          <div className={styles.userInfo}>
            <span className={styles.userName}>David Anderson</span>
            <span className={styles.userRole}>Performance Mentor</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""} ${collapsed ? styles.navItemCollapsed : ""}`}
              data-tip={collapsed ? item.label : undefined}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
            </a>
          );
        })}
      </nav>

    </aside>
  );
}
