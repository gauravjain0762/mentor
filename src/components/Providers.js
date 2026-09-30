"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SWRConfig, mutate } from "swr";
import Pusher from "pusher-js";
import { apiFetch, getMentorProfile } from "@/lib/api";
import { PUSHER_KEY, PUSHER_CLUSTER } from "@/lib/pusher";

// Subscribes once the mentor is signed in (their id only exists in localStorage after
// login, and this provider doesn't remount on client-side navigation, so we recheck on
// every route change until a connection is established, then stay connected for the rest
// of the session).
function useTrainerMessageSubscription() {
  const pathname = usePathname();
  const pusherRef = useRef(null);

  useEffect(() => {
    if (pusherRef.current || !PUSHER_KEY || !PUSHER_CLUSTER) return;

    const mentor = getMentorProfile();
    if (!mentor?.id) return;

    const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER });
    const channel = pusher.subscribe(`mentor-${mentor.id}`);

    const onNewMessage = (payload) => {
      if (!payload?.conversationId || !payload?.messageId) return;

      const message = {
        id: payload.messageId,
        senderId: payload.senderId,
        senderName: payload.senderName,
        senderType: payload.senderType || "pt",
        message: payload.message,
        timestamp: payload.timestamp,
        read: payload.read,
      };

      // Patch the conversation's cached messages if it's loaded anywhere (open or not);
      // no-op (returns the same reference) if that conversation isn't in cache yet.
      mutate(
        `/api/mentor/messages/conversations/${payload.conversationId}`,
        (current) => {
          if (!current) return current;
          const existing = current.data?.messages || [];
          if (existing.some((m) => String(m.id) === String(message.id))) return current;
          return { ...current, data: { ...current.data, messages: [...existing, message] } };
        },
        { revalidate: false }
      );

      // Refresh the conversation list so previews/unread counts pick up the new message.
      mutate("/api/mentor/messages/conversations");
    };

    channel.bind("new-message-from-trainer", onNewMessage);

    pusherRef.current = pusher;

    return () => {
      channel.unbind("new-message-from-trainer", onNewMessage);
      pusher.unsubscribe(`mentor-${mentor.id}`);
      pusher.disconnect();
      pusherRef.current = null;
    };
  }, [pathname]);
}

export default function Providers({ children }) {
  useTrainerMessageSubscription();

  return (
    <SWRConfig
      value={{
        fetcher: (path) => apiFetch(path),
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 15000,
        errorRetryCount: 2,
      }}
    >
      {children}
    </SWRConfig>
  );
}
