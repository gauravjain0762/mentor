"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";

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
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    try {
      setLoading(true);
      const data = await apiFetch("/api/mentor/messages/conversations");
      const convs = data.data?.conversations || [];
      setConversations(convs);
      if (convs.length > 0) {
        setActive(convs[0]);
        fetchMessages(convs[0].id);
      }
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load conversations");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(convId) {
    try {
      setMsgLoading(true);
      const data = await apiFetch(`/api/mentor/messages/conversations/${convId}`);
      setMessages(data.data?.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setMsgLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!input.trim() || !active) return;
    try {
      await apiFetch("/api/mentor/messages/send", {
        method: "POST",
        body: JSON.stringify({ conversationId: active.id, ptId: active.ptId, message: input }),
      });
      setInput("");
      fetchMessages(active.id);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  const handleSelectConversation = (conv) => {
    setActive(conv);
    fetchMessages(conv.id);
  };

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
              {loading ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>Loading conversations...</div>
              ) : error ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#ff6b6b" }}>{error}</div>
              ) : conversations.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No conversations yet</div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`${styles.convItem} ${active?.id === conv.id ? styles.convActive : ""}`}
                    onClick={() => handleSelectConversation(conv)}
                  >
                    <div style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 6, overflow: "hidden" }}>
                      <Image src={conv.ptAvatar} alt={conv.ptName} width={28} height={28} unoptimized style={{ borderRadius: 6, objectFit: "cover" }} />
                    </div>

                    <div className={styles.convInfo}>
                      <div className={styles.convTop}>
                        <span className={styles.convName}>{conv.ptName}</span>
                        <span className={styles.convTime}>{new Date(conv.lastMessageTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className={styles.convPreview}>{conv.lastMessage || "No messages yet"}</p>
                    </div>
                    {conv.unreadCount > 0 && <span style={{ background: "#f8e396", color: "#111", borderRadius: 10, padding: "2px 6px", fontSize: 11, fontWeight: 600 }}>{conv.unreadCount}</span>}
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* ── Right: chat ── */}
          <main className={styles.chatMain}>

            {/* Header */}
            {active && (
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderLeft}>
                <Image src={active.ptAvatar} alt={active.ptName} width={36} height={36} unoptimized style={{ borderRadius: 8, objectFit: "cover" }} />
                <div style={{ marginLeft: 12 }}>
                  <p className={styles.chatHeaderName}>{active.ptName}</p>
                </div>
              </div>
            </div>
            )}

            {/* Messages */}
            <div className={styles.messages}>
              {msgLoading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading messages...</div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>No messages yet. Start the conversation!</div>
              ) : (
                <>
                  <div className={styles.dateSep}>
                    <span className={styles.dateLine} />
                    <span className={styles.dateLabel}>{new Date(messages[0].timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
                    <span className={styles.dateLine} />
                  </div>

                  {messages.map((msg) => (
                    <div key={msg.id} className={`${styles.msgRow} ${msg.senderType === "mentor" ? styles.msgRowMe : ""}`}>
                      {msg.senderType !== "mentor" && (
                        <Image src={active.ptAvatar} alt={msg.senderName} width={28} height={28} unoptimized className={styles.msgAvatar} />
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
                        <Image src="https://i.pravatar.cc/150?img=33" alt="me" width={28} height={28} unoptimized className={styles.msgAvatar} />
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Input */}
            {active && (
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
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
              />
              <button className={styles.sendBtn} onClick={handleSendMessage} disabled={!input.trim()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            )}

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
