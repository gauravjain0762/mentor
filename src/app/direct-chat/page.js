"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";

const TRAINER_DATA = {
  "Julian Vance": {
    name: "Julian Vance",
    role: "Elite Tier Trainer",
    gym: "Nexus Central Hub",
    img: "https://i.pravatar.cc/150?img=11",
    online: true,
    messages: [
      { id: 1, sender: "other", text: "Good morning. I've completed the weekly client performance review. All targets are within expected range.", time: "09:10" },
      { id: 2, sender: "me",    text: "Excellent. Any clients flagged for additional support?", time: "09:13" },
      { id: 3, sender: "other", text: "Two clients showed a drop in session attendance. I've scheduled a check-in call with both.", time: "09:15" },
      { id: 4, sender: "me",    text: "Good initiative. Keep me updated after the calls.", time: "09:18" },
      { id: 5, sender: "other", text: "Will do. I'll send you a summary by end of day.", time: "09:20" },
    ],
  },
  "Alistair Sterling": {
    name: "Alistair Sterling",
    role: "Elite Tier Trainer",
    gym: "Nexus South Hub",
    img: "https://i.pravatar.cc/150?img=12",
    online: true,
    messages: [
      { id: 1, sender: "other", text: "The new intake group has settled in well. Three standout performers already.", time: "10:05" },
      { id: 2, sender: "me",    text: "That's promising. What's their compliance rate looking like?", time: "10:08" },
      { id: 3, sender: "other", text: "Currently at 91%. Well above the minimum threshold.", time: "10:11" },
      { id: 4, sender: "me",    text: "Keep pushing them. We want that above 95% by month end.", time: "10:14" },
      { id: 5, sender: "other", text: "Understood. I'll increase session intensity for the stronger candidates.", time: "10:17" },
    ],
  },
  "Evelyn Cross": {
    name: "Evelyn Cross",
    role: "Pro Tier Trainer",
    gym: "Vanguard East",
    img: "https://i.pravatar.cc/150?img=5",
    online: false,
    messages: [
      { id: 1, sender: "other", text: "The nutrition module feedback has been overwhelmingly positive this cycle.", time: "11:30" },
      { id: 2, sender: "me",    text: "Great to hear. Are clients sticking to the revised meal plans?", time: "11:33" },
      { id: 3, sender: "other", text: "Mostly yes. A couple need more guidance on portion control.", time: "11:36" },
      { id: 4, sender: "me",    text: "Schedule one-on-ones for those clients this week.", time: "11:40" },
      { id: 5, sender: "other", text: "Already booked them in for Thursday.", time: "11:42" },
    ],
  },
  "Marcus Thorne": {
    name: "Marcus Thorne",
    role: "Elite Tier Trainer",
    gym: "Obsidian West",
    img: "https://i.pravatar.cc/150?img=15",
    online: true,
    messages: [
      { id: 1, sender: "other", text: "All equipment on my floor has passed the monthly safety inspection.", time: "08:45" },
      { id: 2, sender: "me",    text: "Good. Any maintenance requests pending?", time: "08:48" },
      { id: 3, sender: "other", text: "Just one — treadmill unit 4 needs a belt replacement. Already raised the ticket.", time: "08:51" },
      { id: 4, sender: "me",    text: "Follow it up with facilities if it's not resolved by Friday.", time: "08:54" },
      { id: 5, sender: "other", text: "Will do. Everything else is running smoothly.", time: "08:56" },
    ],
  },
  "Danny Olive": {
    name: "Danny Olive",
    role: "Elite Tier Trainer",
    gym: "Nexus Central Hub",
    img: "https://i.pravatar.cc/150?img=17",
    online: false,
    messages: [
      { id: 1, sender: "other", text: "Client retention for my group dropped slightly this month — mainly scheduling conflicts.", time: "13:00" },
      { id: 2, sender: "me",    text: "How many clients are affected?", time: "13:03" },
      { id: 3, sender: "other", text: "Four clients requested time slot changes. I've accommodated three so far.", time: "13:06" },
      { id: 4, sender: "me",    text: "Get the fourth sorted by tomorrow and send me the updated schedule.", time: "13:10" },
      { id: 5, sender: "other", text: "On it. I'll have it to you by morning.", time: "13:12" },
    ],
  },
};

const DEFAULT_TRAINER = TRAINER_DATA["Julian Vance"];

function DirectChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trainer, setTrainer] = useState(DEFAULT_TRAINER);
  const [messages, setMessages] = useState(DEFAULT_TRAINER.messages);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const name = searchParams.get("trainer");
    if (name) {
      const decoded = decodeURIComponent(name);
      const found = TRAINER_DATA[decoded];
      if (found) {
        setTrainer(found);
        setMessages(found.messages);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [...prev, { id: Date.now(), sender: "me", text, time }]);
    setInput("");
  }

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.rightSection}>
        <TopBar />

        <div className={styles.chatWrap}>

          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <button className={styles.backBtn} onClick={() => router.push("/pt-dashboard")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={styles.avatarWrap}>
                <Image
                  src={trainer.img}
                  alt={trainer.name}
                  width={40}
                  height={40}
                  unoptimized
                  className={styles.headerAvatar}
                />
                <span className={`${styles.onlineDot} ${trainer.online ? styles.dotGreen : styles.dotGray}`} />
              </div>
              <div>
                <p className={styles.headerName}>{trainer.name}</p>
                <p className={styles.headerSub}>{trainer.role} · {trainer.gym}</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <span className={`${styles.statusPill} ${trainer.online ? styles.pillGreen : styles.pillGray}`}>
                {trainer.online ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            <div className={styles.dateSep}>
              <span className={styles.dateLine} />
              <span className={styles.dateLabel}>TODAY</span>
              <span className={styles.dateLine} />
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.msgRow} ${msg.sender === "me" ? styles.msgRowMe : ""}`}>
                {msg.sender !== "me" && (
                  <Image
                    src={trainer.img}
                    alt={trainer.name}
                    width={30}
                    height={30}
                    unoptimized
                    className={styles.msgAvatar}
                  />
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
                  <Image
                    src="https://i.pravatar.cc/150?img=33"
                    alt="me"
                    width={30}
                    height={30}
                    unoptimized
                    className={styles.msgAvatar}
                  />
                )}
              </div>
            ))}
            <div ref={bottomRef} />
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
              placeholder={`Message ${trainer.name}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            />
            <button className={styles.sendBtn} onClick={sendMessage}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function DirectChatPage() {
  return (
    <Suspense fallback={<div style={{ color: "#555", padding: 40 }}>Loading...</div>}>
      <DirectChatContent />
    </Suspense>
  );
}
