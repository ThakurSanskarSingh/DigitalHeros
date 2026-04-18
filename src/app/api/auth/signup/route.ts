import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { signUpSchema } from "@/lib/validations/schemas"
import { z } from "zod"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validated = signUpSchema.parse(body)

    const supabase = createAdminClient()

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: true, // Auto-confirm email for smoother UX
    })

    if (authError || !authData.user) {
      console.error("Auth error:", authError)

      // Check for common errors
      if (authError?.message?.includes("already registered")) {
        return NextResponse.json(
          { error: "This email is already registered" },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: authError?.message || "Failed to create account" },
        { status: 400 }
      )
    }

    // Create user profile in users table
    const { error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email: validated.email,
        full_name: validated.fullName,
        charity_id: validated.charityId,
        charity_pct: validated.charityPct,
        is_admin: false,
      })

    if (profileError) {
      console.error("Profile creation error:", profileError)

      // Attempt to clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)

      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        userId: authData.user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
