"use client"

import type React from "react"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { Sprout, Droplets, Sun } from "lucide-react"
import Image from "next/image"
import HeroStats from "@/components/HeroStats"

export default function Home() {
  const router = useRouter()
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [loading, setLoading] = useState<"login" | "signup" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)

  const configured = isFirebaseConfigured()

  const authSectionRef = useRef<HTMLDivElement | null>(null)
  const loginEmailRef = useRef<HTMLInputElement | null>(null)

  function revealAuthAndScroll() {
    if (!showAuth) setShowAuth(true)
    // Allow render, then scroll and focus
    setTimeout(() => {
      authSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      loginEmailRef.current?.focus()
    }, 50)
  }

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
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background agriculture gradient + subtle animated shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[90vw] rounded-full bg-gradient-to-r from-green-300/40 via-emerald-200/30 to-lime-200/40 blur-3xl animate-in fade-in-0 zoom-in-95" />
        <div className="absolute bottom-[-6rem] right-[-6rem] h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-200/40 to-green-300/50 blur-2xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <section className="max-w-5xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-secondary/40 animate-in fade-in-0 slide-in-from-top-2">
            Smart agriculture • NDVI • Crop insights
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-pretty">
            FarmAssist
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Analyze fields, track NDVI and vegetation indices, and make data‑driven decisions for healthier yields.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button size="lg" className="shadow-md" onClick={revealAuthAndScroll}>
              Get started
            </Button>
          </div>

          {/* Agriculture themed feature badges */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 rounded-lg border p-4 bg-secondary/40 animate-in fade-in-0 slide-in-from-bottom-1">
              <Sprout className="h-5 w-5 text-emerald-600" />
              <span className="text-sm">Vegetation indices</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-lg border p-4 bg-secondary/40 animate-in fade-in-0 slide-in-from-bottom-1 delay-100">
              <Droplets className="h-5 w-5 text-sky-600" />
              <span className="text-sm">Irrigation cues</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-lg border p-4 bg-secondary/40 animate-in fade-in-0 slide-in-from-bottom-1 delay-200">
              <Sun className="h-5 w-5 text-amber-600" />
              <span className="text-sm">Weather readiness</span>
            </div>
          </div>

          {/* Animated stats */}
          <div className="mt-10">
            <HeroStats />
          </div>

          {/* Preview panel */}
          <div className="mt-10 max-w-5xl mx-auto">
            <div className="rounded-xl border bg-card overflow-hidden shadow-sm group">
              <div className="relative aspect-[16/7] w-full">
                <Image
                  src="/image.png"
                  alt="Field preview"
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="rounded-lg border p-4 bg-secondary/40 text-sm">
              <div className="text-2xl font-semibold">12</div>
              Active fields
            </div>
            <div className="rounded-lg border p-4 bg-secondary/40 text-sm">
              <div className="text-2xl font-semibold">+18%</div>
              Avg. NDVI improvement
            </div>
            <div className="rounded-lg border p-4 bg-secondary/40 text-sm">
              <div className="text-2xl font-semibold">3d</div>
              Forecast horizon
            </div>
          </div>
          {/* How it works */}
          <section className="mt-12 max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold text-center mb-6">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border bg-secondary/40 p-4 animate-in fade-in-0 slide-in-from-bottom-1">
                <div className="text-sm font-medium">1. Select your field</div>
                <p className="text-muted-foreground text-sm mt-1">Mark boundaries and connect satellite layers.</p>
              </div>
              <div className="rounded-xl border bg-secondary/40 p-4 animate-in fade-in-0 slide-in-from-bottom-1 delay-100">
                <div className="text-sm font-medium">2. Analyze NDVI</div>
                <p className="text-muted-foreground text-sm mt-1">See trends, anomalies, irrigation cues.</p>
              </div>
              <div className="rounded-xl border bg-secondary/40 p-4 animate-in fade-in-0 slide-in-from-bottom-1 delay-200">
                <div className="text-sm font-medium">3. Take action</div>
                <p className="text-muted-foreground text-sm mt-1">Get recommendations and track outcomes.</p>
              </div>
            </div>
          </section>
        </section>

        {/* Only show config warning when auth is revealed */}
        {showAuth && !configured && (
          <div className="max-w-4xl mx-auto mb-6 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-900 dark:text-yellow-200 p-3 text-sm">
            Firebase is not configured locally. Add NEXT_PUBLIC_FIREBASE_* to .env.local, then restart the dev server.
          </div>
        )}

        {showAuth && error && <div className="max-w-2xl mx-auto mb-6 text-sm text-destructive">{error}</div>}

        {/* Auth forms */}
        {showAuth && (
          <div id="auth" ref={authSectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="backdrop-blur supports-[backdrop-filter]:bg-card/80 animate-in fade-in-0 slide-in-from-bottom-2">
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
                    ref={loginEmailRef}
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

          <Card className="backdrop-blur supports-[backdrop-filter]:bg-card/80 animate-in fade-in-0 slide-in-from-bottom-2 delay-150">
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
        )}
      </div>
    </main>
  )
}
