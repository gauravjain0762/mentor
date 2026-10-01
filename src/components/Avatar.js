"use client";

import Image from "next/image";
import styles from "./Avatar.module.css";

function getInitials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "UPT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Drop-in replacement for next/image avatars: renders the real photo when `src` is
// truthy, otherwise falls back to the person's initials instead of a stock photo.
// Pass the SAME className you'd have given the <Image> (e.g. a page's `.ptAvatar`) so
// border-radius/sizing from that module applies identically to both states.
export default function Avatar({ src, name, size = 32, className = "" }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name || "Avatar"}
        width={size}
        height={size}
        unoptimized
        className={className}
      />
    );
  }

  return (
    <div
      className={`${styles.initials} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(9, Math.round(size * 0.36)),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label={name || "Avatar"}
    >
      {getInitials(name)}
    </div>
  );
}
