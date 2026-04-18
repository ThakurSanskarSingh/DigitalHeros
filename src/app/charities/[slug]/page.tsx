import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { auth } from "@/lib/auth/config";
import CharityProfileClient from "./CharityProfileClient";

interface CharityEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  image_url: string | null;
  created_at: string;
}

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  website_url: string | null;
  is_featured: boolean;
  is_active: boolean;
}

async function getCharityBySlug(slug: string) {
  const supabase = await createClient();

  const { data: charity, error } = await supabase
    .from("charities")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !charity) {
    return null;
  }

  return charity as Charity;
}

async function getCharityEvents(charityId: string) {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("charity_events")
    .select("*")
    .eq("charity_id", charityId)
    .order("event_date", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching charity events:", error);
    return [];
  }

  return events as CharityEvent[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const charity = await getCharityBySlug(slug);

  if (!charity) {
    return {
      title: "Charity Not Found",
      description: "The charity you're looking for could not be found.",
    };
  }

  const description =
    charity.description.length > 160
      ? charity.description.substring(0, 157) + "..."
      : charity.description;

  return {
    title: `${charity.name} | Digital Hero`,
    description: description,
    openGraph: {
      title: charity.name,
      description: description,
      images: charity.logo_url ? [charity.logo_url] : [],
    },
  };
}

export default async function CharityProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  // Fetch charity data
  const charity = await getCharityBySlug(slug);

  if (!charity) {
    notFound();
  }

  // Fetch charity events
  const events = await getCharityEvents(charity.id);

  // Check if this is the user's selected charity
  const isSelectedCharity = session?.user?.charityId === charity.id;

  return (
    <CharityProfileClient
      charity={charity}
      events={events}
      isAuthenticated={!!session}
      isSelectedCharity={isSelectedCharity}
      userId={session?.user?.id}
    />
  );
}
