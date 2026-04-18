import NextAuth, { type DefaultSession } from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import Credentials from "next-auth/providers/credentials"
import { createAdminClient } from "@/lib/supabase/admin"
import { z } from "zod"

// Extend the session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isAdmin: boolean
      charityId?: string
      charityPct: number
    } & DefaultSession["user"]
  }

  interface User {
    isAdmin?: boolean
    charityId?: string
    charityPct?: number
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)
          const supabase = createAdminClient()

          // Sign in with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (authError || !authData.user) {
            return null
          }

          // Fetch user profile
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, email, full_name, avatar_url, charity_id, charity_pct, is_admin")
            .eq("id", authData.user.id)
            .single()

          if (userError || !userData) {
            return null
          }

          return {
            id: userData.id,
            email: userData.email,
            name: userData.full_name,
            image: userData.avatar_url,
            isAdmin: userData.is_admin || false,
            charityId: userData.charity_id,
            charityPct: userData.charity_pct || 10,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    newUser: "/onboarding",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.isAdmin = user.isAdmin || false
        token.charityId = user.charityId
        token.charityPct = user.charityPct || 10
      }

      // Handle session updates
      if (trigger === "update" && session) {
        return { ...token, ...session.user }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.charityId = token.charityId as string | undefined
        session.user.charityPct = token.charityPct as number
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
})
