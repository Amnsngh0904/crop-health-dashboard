import { initializeApp, getApps, type FirebaseApp } from "firebase/app"

let app: FirebaseApp | null = null

function readEnv(name: string) {
  // Trim to avoid accidental whitespace/quotes in env values
  const val = (process.env[name] ?? "").trim()
  return val
}

function assertFirebaseConfig(cfg: Record<string, string>) {
  const missing: string[] = []
  for (const [k, v] of Object.entries(cfg)) {
    if (!v || v.toLowerCase() === "undefined") {
      missing.push(k)
    }
  }
  if (missing.length) {
    // Provide a clear, actionable error for setup
    throw new Error(
      `[Firebase] Missing/invalid env vars: ${missing.join(
        ", ",
      )}. Please set NEXT_PUBLIC_FIREBASE_* variables in Project Settings.`,
    )
  }
}

export function isFirebaseConfigured(): boolean {
  const must = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ]
  for (const k of must) {
    const v = (process.env[k] ?? "").trim()
    if (!v || v.toLowerCase() === "undefined") return false
  }
  return true
}

export function getFirebaseApp(): FirebaseApp {
  if (app) return app

  const config = {
    apiKey: readEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  }

  assertFirebaseConfig(config)

  if (!getApps().length) {
    app = initializeApp(config)
  } else {
    app = getApps()[0]!
  }
  return app!
}
