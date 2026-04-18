import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const updateCharitySchema = z.object({
  charityId: z.string().uuid(),
});

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { charityId } = updateCharitySchema.parse(body);

    const supabase = createAdminClient();

    // Verify charity exists and is active
    const { data: charity, error: charityError } = await supabase
      .from("charities")
      .select("id, name, is_active")
      .eq("id", charityId)
      .single();

    if (charityError || !charity) {
      return NextResponse.json(
        { error: "Charity not found" },
        { status: 404 }
      );
    }

    if (!charity.is_active) {
      return NextResponse.json(
        { error: "This charity is not currently active" },
        { status: 400 }
      );
    }

    // Update user's charity selection
    const { error: updateError } = await supabase
      .from("users")
      .update({ charity_id: charityId })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Error updating user charity:", updateError);
      return NextResponse.json(
        { error: "Failed to update charity selection" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully selected ${charity.name}`,
      charityId: charityId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Unexpected error in PATCH /api/user/charity:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
