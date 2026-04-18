import { auth } from "@/lib/auth/config"
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const scoreSchema = z.object({
  score: z.number().int().min(1).max(45, "Score must be between 1 and 45"),
  playedOn: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
})

// GET - Fetch user's scores (up to 5, ordered by played_on DESC)
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    const { data: scores, error } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", session.user.id)
      .order("played_on", { ascending: false })
      .limit(5)

    if (error) {
      console.error("Error fetching scores:", error)
      return NextResponse.json(
        { error: "Failed to fetch scores" },
        { status: 500 }
      )
    }

    return NextResponse.json({ scores })
  } catch (error) {
    console.error("Error in GET /api/scores:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new score (with rolling 5-score logic)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    // Validate input
    const validation = scoreSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { score, playedOn } = validation.data
    const userId = session.user.id

    const supabase = await createClient()

    // Check for duplicate date
    const { data: existingScore, error: checkError } = await supabase
      .from("scores")
      .select("id")
      .eq("user_id", userId)
      .eq("played_on", playedOn)
      .single()

    if (existingScore) {
      return NextResponse.json(
        { error: "A score already exists for this date" },
        { status: 400 }
      )
    }

    // Count existing scores
    const { count, error: countError } = await supabase
      .from("scores")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (countError) {
      console.error("Error counting scores:", countError)
      return NextResponse.json(
        { error: "Failed to check score count" },
        { status: 500 }
      )
    }

    // If user has 5 scores, delete the oldest one
    if (count && count >= 5) {
      const { data: oldestScore, error: oldestError } = await supabase
        .from("scores")
        .select("id")
        .eq("user_id", userId)
        .order("played_on", { ascending: true })
        .limit(1)
        .single()

      if (oldestError) {
        console.error("Error fetching oldest score:", oldestError)
        return NextResponse.json(
          { error: "Failed to manage score limit" },
          { status: 500 }
        )
      }

      if (oldestScore) {
        const { error: deleteError } = await supabase
          .from("scores")
          .delete()
          .eq("id", oldestScore.id)

        if (deleteError) {
          console.error("Error deleting oldest score:", deleteError)
          return NextResponse.json(
            { error: "Failed to delete oldest score" },
            { status: 500 }
          )
        }
      }
    }

    // Insert the new score
    const { data: newScore, error: insertError } = await supabase
      .from("scores")
      .insert({
        user_id: userId,
        score,
        played_on: playedOn,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting score:", insertError)
      return NextResponse.json(
        { error: "Failed to create score" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: "Score created successfully",
        score: newScore
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error in POST /api/scores:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
