"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";

const GROUPS = [
  {
    id: 1,
    name: "Sgt. Valerius, Master Kaelen & Operative Aria",
    sub: "Aethelgard High Command Fitness",
    lastMsg: "The sector 7 perime...",
    time: "14:22",
    secure: true,
    members: [
      { name: "Julian Vance",      img: "https://i.pravatar.cc/150?img=11" },
      { name: "Alistair Sterling", img: "https://i.pravatar.cc/150?img=12" },
      { name: "Evelyn Cross",      img: "https://i.pravatar.cc/150?img=5"  },
    ],
    messages: [
      { id: 1, sender: "Julian Vance",      img: "https://i.pravatar.cc/150?img=11", text: "Administrator, I've concluded the review of the current personnel roster. The recent optimizations in Sector 4 are yielding better-than-expected throughput. Find the detailed report attached below.", highlights: ["optimizations in Sector 4", "yielding", "Find the"], time: "14:15" },
      { id: 2, sender: "Julian Vance",      img: "https://i.pravatar.cc/150?img=11", type: "file", fileName: "Performance Report.pdf", fileSize: "2.4 MB · High Security Level", time: "14:15" },
      { id: 3, sender: "Alistair Sterling", img: "https://i.pravatar.cc/150?img=12", text: "Scanners in Sector 4 are reporting minor interference on the secondary uplink. Investigating now.", highlights: ["Sector 4", "secondary uplink"], time: "14:17" },
      { id: 4, sender: "me", text: "Acknowledged, Sergeant. I'll review the metrics within the hour. Keep the high-frequency scanners active in that quadrant until my further notice.", highlights: ["high-frequency scanners"], time: "14:18" },
    ],
  },
  {
    id: 2,
    name: "Commander Thorne, Operative Olive & Agent Cross",
    sub: "Aethelgard High Command Fitness",
    lastMsg: "All perimeter checks confirmed.",
    time: "13:40",
    secure: false,
    members: [
      { name: "Marcus Thorne", img: "https://i.pravatar.cc/150?img=15" },
      { name: "Danny Olive",   img: "https://i.pravatar.cc/150?img=17" },
      { name: "Evelyn Cross",  img: "https://i.pravatar.cc/150?img=5"  },
    ],
    messages: [
      { id: 1, sender: "Marcus Thorne", img: "https://i.pravatar.cc/150?img=15", text: "Weekly readiness report submitted. All units at optimal capacity.", time: "13:10" },
      { id: 2, sender: "Danny Olive",   img: "https://i.pravatar.cc/150?img=17", text: "Confirmed. Sector B training logs have been uploaded to the secure archive.", time: "13:18" },
      { id: 3, sender: "me", text: "Good work. Ensure the evening debrief is logged by 22:00 hours.", time: "13:30" },
      { id: 4, sender: "Marcus Thorne", img: "https://i.pravatar.cc/150?img=15", text: "All perimeter checks confirmed.", time: "13:40" },
    ],
  },
  {
    id: 3,
    name: "Agent Vance, Operative Sterling & Cmd. Thorne",
    sub: "Aethelgard High Command Fitness",
    lastMsg: "Protocol Delta is live.",
    time: "11:55",
    secure: true,
    members: [
      { name: "Julian Vance",      img: "https://i.pravatar.cc/150?img=11" },
      { name: "Alistair Sterling", img: "https://i.pravatar.cc/150?img=12" },
      { name: "Marcus Thorne",     img: "https://i.pravatar.cc/150?img=15" },
    ],
    messages: [
      { id: 1, sender: "Alistair Sterling", img: "https://i.pravatar.cc/150?img=12", text: "New intake cohort briefed. Compliance rate across the board is above 90%.", time: "11:30" },
      { id: 2, sender: "Julian Vance",      img: "https://i.pravatar.cc/150?img=11", text: "Protocol Delta has been approved by high command. Implementation begins at 06:00.", time: "11:45" },
      { id: 3, sender: "me", text: "Proceed as planned. Notify me if any resistance is detected during rollout.", time: "11:50" },
      { id: 4, sender: "Marcus Thorne",     img: "https://i.pravatar.cc/150?img=15", text: "Protocol Delta is live.", time: "11:55" },
    ],
  },
  {
    id: 4,
    name: "Cmd. Cross, Agent Olive & Operative Vance",
    sub: "Aethelgard High Command Fitness",
    lastMsg: "Nutrition logs filed for Q4.",
    time: "10:12",
    secure: false,
    members: [
      { name: "Evelyn Cross",  img: "https://i.pravatar.cc/150?img=5"  },
      { name: "Danny Olive",   img: "https://i.pravatar.cc/150?img=17" },
      { name: "Julian Vance",  img: "https://i.pravatar.cc/150?img=11" },
    ],
    messages: [
      { id: 1, sender: "Evelyn Cross", img: "https://i.pravatar.cc/150?img=5",  text: "Q4 nutrition and recovery protocols have been distributed to all assigned clients.", time: "09:45" },
      { id: 2, sender: "Danny Olive",  img: "https://i.pravatar.cc/150?img=17", text: "Client feedback from last week's sessions has been compiled. Overall sentiment is positive.", time: "09:52" },
      { id: 3, sender: "me", text: "Good. Attach the feedback summary to this week's performance review packet.", time: "10:05" },
      { id: 4, sender: "Evelyn Cross", img: "https://i.pravatar.cc/150?img=5",  text: "Nutrition logs filed for Q4.", time: "10:12" },
    ],
  },
  {
    id: 5,
    name: "Operative Thorne, Agent Sterling & Cmd. Olive",
    sub: "Aethelgard High Command Fitness",
    lastMsg: "Night shift handover complete.",
    time: "08:30",
    secure: false,
    members: [
      { name: "Marcus Thorne",     img: "https://i.pravatar.cc/150?img=15" },
      { name: "Alistair Sterling", img: "https://i.pravatar.cc/150?img=12" },
      { name: "Danny Olive",       img: "https://i.pravatar.cc/150?img=17" },
    ],
    messages: [
      { id: 1, sender: "Marcus Thorne",     img: "https://i.pravatar.cc/150?img=15", text: "Morning briefing completed. All stations are fully staffed and operational.", time: "08:05" },
      { id: 2, sender: "Alistair Sterling", img: "https://i.pravatar.cc/150?img=12", text: "Equipment checks passed across all training floors. No faults detected.", time: "08:15" },
      { id: 3, sender: "me", text: "Noted. Ensure the incident register is updated before the 09:00 review.", time: "08:22" },
      { id: 4, sender: "Danny Olive",       img: "https://i.pravatar.cc/150?img=17", text: "Night shift handover complete.", time: "08:30" },
    ],
  },
];

function HighlightText({ text, highlights }) {
  if (!highlights?.length) return <span>{text}</span>;
  const pattern = new RegExp(
    `(${highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const parts = text.split(pattern);
  return (
    <span>
      {parts.map((part, i) =>
        highlights.some(h => h.toLowerCase() === part.toLowerCase())
          ? <span key={i} className={styles.highlight}>{part}</span>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

function StackedAvatars({ members, size, offset, borderColor }) {
  const totalWidth = size + offset * (members.length - 1);
  return (
    <div className={styles.stackedWrap} style={{ width: totalWidth, height: size, flexShrink: 0 }}>
      {members.map((m, i) => (
        <Image
          key={i}
          src={m.img}
          alt={m.name}
          width={size}
          height={size}
          unoptimized
          className={styles.stackedAvatar}
          style={{
            left: i * offset,
            zIndex: members.length - i,
            borderColor: borderColor || "#090909",
          }}
        />
      ))}
    </div>
  );
}

function MessagingContent() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState(GROUPS[0]);

  useEffect(() => {
    const name = searchParams.get("trainer");
    if (name) {
      const decoded = decodeURIComponent(name);
      const found = GROUPS.find(g => g.members.some(m => m.name === decoded));
      if (found) setActive(found);
    }
  }, [searchParams]);

  const [input, setInput] = useState("");

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.rightSection}>
        <TopBar />

        <div className={styles.body}>

          {/* ── Left: conversation list ── */}
          <aside className={styles.leftPanel}>

            <div className={styles.searchBar}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input className={styles.searchInput} placeholder="Search" />
            </div>

            <div className={styles.convList}>
              {GROUPS.map((g) => (
                <div
                  key={g.id}
                  className={`${styles.convItem} ${active.id === g.id ? styles.convActive : ""}`}
                  onClick={() => setActive(g)}
                >
                  <StackedAvatars members={g.members} size={28} offset={13} />

                  <div className={styles.convInfo}>
                    <div className={styles.convTop}>
                      <span className={styles.convName}>{g.name}</span>
                      <span className={styles.convTime}>{g.time}</span>
                    </div>
                    <p className={styles.convPreview}>{g.lastMsg}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Right: chat ── */}
          <main className={styles.chatMain}>

            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderLeft}>
                <StackedAvatars members={active.members} size={36} offset={18} borderColor="#0a0a0a" />
                <div style={{ marginLeft: 8 }}>
                  <p className={styles.chatHeaderName}>{active.name}</p>
                  <p className={styles.chatHeaderSub}>{active.sub}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              <div className={styles.dateSep}>
                <span className={styles.dateLine} />
                <span className={styles.dateLabel}>OCTOBER 24, 2077</span>
                <span className={styles.dateLine} />
              </div>

              {active.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.msgRow} ${msg.sender === "me" ? styles.msgRowMe : ""}`}
                >
                  {msg.sender !== "me" && (
                    <Image
                      src={msg.img}
                      alt={msg.sender}
                      width={28}
                      height={28}
                      unoptimized
                      className={styles.msgAvatar}
                    />
                  )}

                  <div className={styles.msgContent}>
                    {msg.type === "file" ? (
                      <>
                        <div className={styles.fileCard}>
                          <div className={styles.fileIcon}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#f8e396" strokeWidth="2" strokeLinecap="round"/>
                              <polyline points="14 2 14 8 20 8" stroke="#f8e396" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className={styles.fileInfo}>
                            <p className={styles.fileName}>{msg.fileName}</p>
                            <p className={styles.fileSize}>{msg.fileSize}</p>
                          </div>
                          <button className={styles.downloadBtn}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                        <span className={styles.msgTime}>{msg.time}</span>
                      </>
                    ) : (
                      <>
                        <div className={`${styles.bubble} ${msg.sender === "me" ? styles.bubbleMe : styles.bubbleOther}`}>
                          <HighlightText text={msg.text} highlights={msg.highlights} />
                        </div>
                        <span className={`${styles.msgTime} ${msg.sender === "me" ? styles.msgTimeMe : ""}`}>
                          {msg.sender === "me" && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ marginRight: 3 }}>
                              <polyline points="4 12 9 17 20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {msg.time}
                        </span>
                      </>
                    )}
                  </div>

                  {msg.sender === "me" && (
                    <Image
                      src="https://i.pravatar.cc/150?img=33"
                      alt="me"
                      width={28}
                      height={28}
                      unoptimized
                      className={styles.msgAvatar}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className={styles.inputBar}>
              <button className={styles.inputIconBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button className={styles.inputIconBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
              <input
                className={styles.msgInput}
                placeholder="Type an operational directive"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") setInput(""); }}
              />
              <button className={styles.sendBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

export default function MessagingPage() {
  return (
    <Suspense fallback={<div style={{ color: "#555", padding: 40 }}>Loading...</div>}>
      <MessagingContent />
    </Suspense>
  );
}
