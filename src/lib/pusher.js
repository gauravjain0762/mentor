// Public Pusher app key + cluster. This is the publishable key (not the app secret),
// so it's fine to ship client-side — same pair the backend team said is already in use.
// Set these as NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER at runtime.
export const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || "";
export const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "";
