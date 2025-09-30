"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const configured = isFirebaseConfigured()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!configured) {
      setError("Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_* env vars and redeploy.")
      return
    }
    setLoading(true)
    try {
      const auth = getAuth(getFirebaseApp())
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message || "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-900 dark:text-yellow-200 p-3 text-sm">
            {error}
          </div>
        )}
        <Card className="backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !configured}>
                {loading ? "Creating..." : "Create account"}
              </Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account? <Link className="underline" href="/auth/login" target="_blank" rel="noopener noreferrer">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}