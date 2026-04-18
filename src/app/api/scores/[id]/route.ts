import { auth } from "@/lib/auth/config"
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const updateScoreSchema = z.object({
  score: z.number().int().min(1).max(45, "Score must be between 1 and 45").optional(),
  playedOn: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }).optional(),
}).refine((data) => data.score !== undefined || data.playedOn !== undefined, {
  message: "At least one field (score or playedOn) must be provided",
})

// PATCH - Update a score
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()

    // Validate input
    const validation = updateScoreSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify the score belongs to the user
    const { data: existingScore, error: fetchError } = await supabase
      .from("scores")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (fetchError || !existingScore) {
      return NextResponse.json(
        { error: "Score not found" },
        { status: 404 }
      )
    }

    // If updating played_on, check for duplicates
    if (validation.data.playedOn && validation.data.playedOn !== existingScore.played_on) {
      const { data: duplicate } = await supabase
        .from("scores")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("played_on", validation.data.playedOn)
        .single()

      if (duplicate) {
        return NextResponse.json(
          { error: "A score already exists for this date" },
          { status: 400 }
        )
      }
    }

    // Update the score
    const updateData: any = {}
    if (validation.data.score !== undefined) {
      updateData.score = validation.data.score
    }
    if (validation.data.playedOn !== undefined) {
      updateData.played_on = validation.data.playedOn
    }

    const { data: updatedScore, error: updateError } = await supabase
      .from("scores")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating score:", updateError)
      return NextResponse.json(
        { error: "Failed to update score" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Score updated successfully",
      score: updatedScore
    })
  } catch (error) {
    console.error("Error in PATCH /api/scores/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a score
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const supabase = await createClient()

    // Verify the score belongs to the user before deleting
    const { data: existingScore, error: fetchError } = await supabase
      .from("scores")
      .select("id")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (fetchError || !existingScore) {
      return NextResponse.json(
        { error: "Score not found" },
        { status: 404 }
      )
    }

    // Delete the score
    const { error: deleteError } = await supabase
      .from("scores")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id)

    if (deleteError) {
      console.error("Error deleting score:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete score" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Score deleted successfully"
    })
  } catch (error) {
    console.error("Error in DELETE /api/scores/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
