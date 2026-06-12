"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";

const TRAINERS = [
  {
    name: "Julian Vance",
    role: "Elite Trainer",
    img: "https://i.pravatar.cc/150?img=11",
    online: true,
    lastMsg: "Got it, will prep the report.",
    time: "14:22",
    messages: [
      { id: 1, sender: "other", text: "Good morning! I've completed the weekly assessment for all assigned clients.", time: "09:10" },
      { id: 2, sender: "me",    text: "Great work. Any flagged concerns from the assessments?", time: "09:13" },
      { id: 3, sender: "other", text: "Two clients showed reduced endurance metrics — Candidate Delta-4 and Recruit J. Recommend follow-up sessions.", time: "09:15" },
      { id: 4, sender: "me",    text: "Noted. Schedule follow-ups for both and send me the detailed logs by EOD.", time: "09:18" },
      { id: 5, sender: "other", text: "Got it, will prep the report.", time: "09:19" },
    ],
  },
  {
    name: "Alistair Sterling",
    role: "Elite Trainer",
    img: "https://i.pravatar.cc/150?img=12",
    online: true,
    lastMsg: "Acknowledged, will sync tomorrow.",
    time: "13:40",
    messages: [
      { id: 1, sender: "other", text: "Session logs for this week have been submitted. All targets met.", time: "13:20" },
      { id: 2, sender: "me",    text: "Excellent. How is the new intake group progressing?", time: "13:25" },
      { id: 3, sender: "other", text: "Faster than expected. Two candidates are already ahead of the standard curve.", time: "13:30" },
      { id: 4, sender: "me",    text: "Keep monitoring them closely. We may fast-track their evaluation.", time: "13:38" },
      { id: 5, sender: "other", text: "Acknowledged, will sync tomorrow.", time: "13:40" },
    ],
  },
  {
    name: "Evelyn Cross",
    role: "Pro Trainer",
    img: "https://i.pravatar.cc/150?img=5",
    online: false,
    lastMsg: "Session report ready for review.",
    time: "12:15",
    messages: [
      { id: 1, sender: "other", text: "I've wrapped up the nutrition coaching module for the assigned group.", time: "11:50" },
      { id: 2, sender: "me",    text: "How did the group respond to the updated protocol?", time: "12:00" },
      { id: 3, sender: "other", text: "Very positively. Compliance rate is at 94% this cycle.", time: "12:08" },
      { id: 4, sender: "me",    text: "That's outstanding. Document it for the quarterly review.", time: "12:12" },
      { id: 5, sender: "other", text: "Session report ready for review.", time: "12:15" },
    ],
  },
  {
    name: "Marcus Thorne",
    role: "Elite Trainer",
    img: "https://i.pravatar.cc/150?img=15",
    online: true,
    lastMsg: "All clear on my end.",
    time: "11:58",
    messages: [
      { id: 1, sender: "me",    text: "Marcus, any issues with the new equipment allocation?", time: "11:40" },
      { id: 2, sender: "other", text: "Minor calibration issue with station 3, already flagged to maintenance.", time: "11:45" },
      { id: 3, sender: "me",    text: "Good catch. Anything else needing attention?", time: "11:52" },
      { id: 4, sender: "other", text: "All clear on my end.", time: "11:58" },
    ],
  },
  {
    name: "Danny Olive",
    role: "Elite Trainer",
    img: "https://i.pravatar.cc/150?img=17",
    online: false,
    lastMsg: "Will update by EOD.",
    time: "10:30",
    messages: [
      { id: 1, sender: "other", text: "Morning. Client retention numbers are slightly below target this month.", time: "10:10" },
      { id: 2, sender: "me",    text: "What's driving the drop? Any specific feedback from clients?", time: "10:18" },
      { id: 3, sender: "other", text: "Scheduling conflicts mainly. A few clients requested time slot changes.", time: "10:24" },
      { id: 4, sender: "me",    text: "Adjust slots where possible and flag any that need my approval.", time: "10:28" },
      { id: 5, sender: "other", text: "Will update by EOD.", time: "10:30" },
    ],
  },
];

export default function MessagingPage() {
  const [active, setActive] = useState(TRAINERS[0]);
  const [input, setInput] = useState("");

  return (
    <div className={styles.layout}>
      <Sidebar />

      {/* ── Trainers list ── */}
      <aside className={styles.trainersPanel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Messages</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div className={styles.searchBar}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input className={styles.searchInput} placeholder="Search trainers..." />
        </div>

        <div className={styles.trainerList}>
          {TRAINERS.map((t) => (
            <div
              key={t.name}
              className={`${styles.trainerItem} ${active.name === t.name ? styles.trainerActive : ""}`}
              onClick={() => setActive(t)}
            >
              <div className={styles.avatarWrap}>
                <Image src={t.img} alt={t.name} width={40} height={40} unoptimized className={styles.trainerAvatar} />
                <span className={`${styles.dot} ${t.online ? styles.dotGreen : styles.dotGray}`} />
              </div>
              <div className={styles.trainerMeta}>
                <div className={styles.trainerRow}>
                  <span className={styles.trainerName}>{t.name}</span>
                  <span className={styles.trainerTime}>{t.time}</span>
                </div>
                <p className={styles.trainerPreview}>{t.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Chat area ── */}
      <main className={styles.chatMain}>
        <TopBar />

        {/* Chat header */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <div className={styles.chatAvatarWrap}>
              <Image src={active.img} alt={active.name} width={38} height={38} unoptimized className={styles.chatAvatar} />
              <span className={`${styles.dot} ${active.online ? styles.dotGreen : styles.dotGray}`} />
            </div>
            <div>
              <p className={styles.chatName}>{active.name}</p>
              <p className={styles.chatSub}>{active.role} · {active.online ? "Online" : "Offline"}</p>
            </div>
          </div>
          <div className={styles.chatHeaderRight}>
            <button className={styles.headerBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {active.messages.map((msg) => (
            <div key={msg.id} className={`${styles.msgRow} ${msg.sender === "me" ? styles.msgRowMe : ""}`}>
              {msg.sender !== "me" && (
                <Image src={active.img} alt="" width={28} height={28} unoptimized className={styles.msgAvatar} />
              )}
              <div className={styles.msgContent}>
                <div className={`${styles.bubble} ${msg.sender === "me" ? styles.bubbleMe : styles.bubbleOther}`}>
                  {msg.text}
                </div>
                <span className={`${styles.msgTime} ${msg.sender === "me" ? styles.msgTimeMe : ""}`}>
                  {msg.sender === "me" && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ marginRight: 3 }}>
                      <polyline points="4 12 9 17 20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {msg.time}
                </span>
              </div>
              {msg.sender === "me" && (
                <Image src="https://i.pravatar.cc/150?img=33" alt="me" width={28} height={28} unoptimized className={styles.msgAvatar} />
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className={styles.inputBar}>
          <button className={styles.inputIconBtn}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <input
            className={styles.msgInput}
            placeholder="Type a message..."
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
  );
}
