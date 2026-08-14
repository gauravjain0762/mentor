"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";

function DirectChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trainer, setTrainer] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const trainerName = searchParams.get("trainer");
    if (trainerName) {
      fetchConversationByTrainer(decodeURIComponent(trainerName));
    }
  }, [searchParams]);

  async function fetchConversationByTrainer(trainerName) {
    try {
      setLoading(true);
      const data = await apiFetch("/api/mentor/messages/conversations");
      const conversations = data.data?.conversations || [];

      const found = conversations.find(c => c.ptName.toLowerCase() === trainerName.toLowerCase());
      if (found) {
        setConversation(found);
        setTrainer({
          name: found.ptName,
          img: found.ptAvatar,
          online: found.status === "online",
          role: "Personal Trainer",
        });

        const msgData = await apiFetch(`/api/mentor/messages/conversations/${found.id}`);
        setMessages(msgData.data?.messages || []);
        setError("");
      } else {
        setError("Trainer conversation not found");
      }
    } catch (err) {
      setError(err.message || "Failed to load conversation");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || !conversation) return;

    try {
      await apiFetch("/api/mentor/messages/send", {
        method: "POST",
        body: JSON.stringify({ conversationId: conversation.id, ptId: conversation.ptId, message: text }),
      });

      setInput("");
      const msgData = await apiFetch(`/api/mentor/messages/conversations/${conversation.id}`);
      setMessages(msgData.data?.messages || []);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  if (loading) return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.rightSection}>
        <TopBar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)", color: "#666" }}>Loading conversation...</div>
      </div>
    </div>
  );

  if (error || !trainer) return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.rightSection}>
        <TopBar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)", color: "#ff6b6b" }}>
          <button className={styles.backBtn} onClick={() => router.push("/pt-dashboard")}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            BACK
          </button>
          {error}
        </div>
      </div>
    </div>
  );

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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                BACK
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
              </div>
              <div>
                <p className={styles.headerName}>{trainer.name}</p>
                <p className={styles.headerSub}>{trainer.role}</p>
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
              <span className={styles.dateLabel}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
              <span className={styles.dateLine} />
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.msgRow} ${msg.senderType === "mentor" ? styles.msgRowMe : ""}`}>
                {msg.senderType !== "mentor" && (
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
                  <div className={`${styles.bubble} ${msg.senderType === "mentor" ? styles.bubbleMe : styles.bubbleOther}`}>
                    {msg.message}
                  </div>
                  <span className={`${styles.msgTime} ${msg.senderType === "mentor" ? styles.msgTimeMe : ""}`}>
                    {msg.senderType === "mentor" && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ marginRight: 3 }}>
                        <polyline points="4 12 9 17 20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.senderType === "mentor" && (
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
            <button className={styles.sendBtn} onClick={sendMessage} disabled={!input.trim()}>
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
