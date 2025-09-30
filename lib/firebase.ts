import { initializeApp, getApps, type FirebaseApp } from "firebase/app"

// IMPORTANT: In Next.js, only direct property access (process.env.X) is inlined on the client.
// Avoid dynamic indexing like process.env[name].
let app: FirebaseApp | null = null

const env = {
  apiKey: (process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "").trim(),
  authDomain: (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "").trim(),
  projectId: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "").trim(),
  storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "").trim(),
  messagingSenderId: (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "").trim(),
  appId: (process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "").trim(),
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    env.apiKey &&
      env.authDomain &&
      env.projectId &&
      env.storageBucket &&
      env.messagingSenderId &&
      env.appId,
  )
}

export function getFirebaseApp(): FirebaseApp {
  if (app) return app

  if (!isFirebaseConfigured()) {
    throw new Error(
      "[Firebase] Missing/invalid NEXT_PUBLIC_FIREBASE_* env vars. Add them to .env.local and restart the dev server.",
    )
  }

  if (!getApps().length) {
    app = initializeApp(env)
  } else {
    app = getApps()[0]!
  }
  return app!
}
