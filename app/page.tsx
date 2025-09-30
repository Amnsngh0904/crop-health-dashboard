"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"

export default function Home() {
  const router = useRouter()
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [loading, setLoading] = useState<"login" | "signup" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const configured = isFirebaseConfigured()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!configured) {
      setError("Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_* env vars and redeploy.")
      return
    }
    setLoading("login")
    try {
      const auth = getAuth(getFirebaseApp())
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message || "Login failed")
    } finally {
      setLoading(null)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!configured) {
      setError("Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_* env vars and redeploy.")
      return
    }
    setLoading("signup")
    try {
      const auth = getAuth(getFirebaseApp())
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message || "Sign up failed")
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-pretty">FarmAssist</h1>
          <p className="mt-2 text-muted-foreground">Analyze fields, track NDVI, and monitor crop health.</p>
        </header>

        {!configured && (
          <div className="max-w-4xl mx-auto mb-6 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-900 dark:text-yellow-200 p-3 text-sm">
            Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* environment variables in Project Settings, then
            redeploy.
          </div>
        )}

        {error && <div className="max-w-2xl mx-auto mb-6 text-sm text-destructive">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-sm">
                    Email
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-sm">
                    Password
                  </label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading === "login" || !configured}>
                  {loading === "login" ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSignup}>
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm">
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading === "signup" || !configured}>
                  {loading === "signup" ? "Creating..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
