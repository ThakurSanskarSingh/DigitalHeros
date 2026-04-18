import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    // Create Supabase client with anon key (safe for public access)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch active charities, ordered by featured status and name
    const { data: charities, error } = await supabase
      .from("charities")
      .select("id, name, slug, description, logo_url, website_url, is_featured")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching charities:", error);
      return NextResponse.json(
        { error: "Failed to fetch charities" },
        { status: 500 },
      );
    }

    return NextResponse.json({ charities });
  } catch (error) {
    console.error("Unexpected error in GET /api/charities:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
