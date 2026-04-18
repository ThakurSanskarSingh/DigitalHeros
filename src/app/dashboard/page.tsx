import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, TrendingUp, Heart, Calendar, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const user = session.user;
  const supabase = await createClient();

  // Fetch user's subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  // Fetch user's scores
  const { data: scores, count: scoresCount } = await supabase
    .from("scores")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("played_on", { ascending: false })
    .limit(5);

  // Fetch user's charity
  const { data: userProfile } = await supabase
    .from("users")
    .select("charity_id, charity_pct, charities(name, slug)")
    .eq("id", user.id)
    .single();

  // Fetch draw entries count
  const { count: drawEntriesCount } = await supabase
    .from("draw_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Fetch winnings count
  const { count: winningsCount } = await supabase
    .from("draw_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gt("prize_amount", 0);

  // Calculate charity impact
  const monthsSinceJoined = subscription
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - new Date(subscription.created_at).getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        ),
      )
    : 0;

  const monthlyContribution = subscription
    ? (subscription.plan === "monthly" ? 10 : 100 / 12) *
      ((userProfile?.charity_pct || 10) / 100)
    : 0;

  const totalCharityImpact = monthlyContribution * monthsSinceJoined;

  const isSubscribed = !!subscription;
  const hasScores = (scoresCount || 0) > 0;
  const hasCharity = !!userProfile?.charity_id;

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name?.split(" ")[0] || "there"}! 👋
        </h1>
        <p className="text-gray-600">
          {isSubscribed
            ? "Track your progress and see your impact"
            : "Get started by subscribing to enter monthly draws"}
        </p>
      </div>

      {/* Alert Banner - Not Subscribed */}
      {!isSubscribed && (
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Start Your Journey Today
              </h3>
              <p className="text-blue-100">
                Subscribe now to enter monthly draws and support your chosen
                charity
              </p>
            </div>
            <Link
              href="/dashboard/subscription"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all whitespace-nowrap"
            >
              Subscribe Now
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {winningsCount || 0}
          </div>
          <div className="text-sm text-gray-600">Total Wins</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {scoresCount || 0}/5
          </div>
          <div className="text-sm text-gray-600">Scores Logged</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            £{totalCharityImpact.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Charity Impact</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {drawEntriesCount || 0}
          </div>
          <div className="text-sm text-gray-600">Draws Entered</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Subscription & Charity */}
        <div className="space-y-6">
          {/* Subscription Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Subscription Status</h2>
            <div className="space-y-4">
              {isSubscribed ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium capitalize">
                      {subscription.plan}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
                      {subscription.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Renews</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(
                        subscription.current_period_end || "",
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    href="/dashboard/subscription"
                    className="block w-full text-center border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:border-gray-400 transition-all"
                  >
                    Manage Subscription
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      Not Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Subscribe to start entering monthly draws and making a
                    difference.
                  </p>
                  <Link
                    href="/dashboard/subscription"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Subscribe Now
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Charity Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-gray-600" />
              Your Charity
            </h2>
            <div className="space-y-4">
              {hasCharity && userProfile.charities ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Supporting</p>
                    <p className="font-semibold text-gray-900">
                      {userProfile.charities.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contribution</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      {userProfile.charity_pct}%
                    </span>
                  </div>
                  <Link
                    href="/dashboard/charity"
                    className="block w-full text-center border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:border-gray-400 transition-all"
                  >
                    Change Charity
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500">
                    Choose a charity to support with your subscription
                  </p>
                  <Link
                    href="/dashboard/charity"
                    className="block w-full text-center bg-gradient-to-r from-pink-600 to-rose-600 text-white py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all"
                  >
                    Select Charity
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Scores */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                Your Scores
              </h2>
              {hasScores && (
                <Link
                  href="/dashboard/scores"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            {hasScores ? (
              <div className="space-y-3">
                {scores?.slice(0, 3).map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(score.played_on).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {score.score}
                    </div>
                  </div>
                ))}
                <Link
                  href="/dashboard/scores"
                  className="block w-full text-center border-2 border-blue-300 text-blue-600 py-2 rounded-lg font-semibold hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  Add New Score
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">No scores logged yet</p>
                <Link
                  href="/dashboard/scores"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Add Your First Score
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Draws & Impact */}
        <div className="space-y-6">
          {/* Upcoming Draw */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Next Draw
            </h2>
            <div className="space-y-2">
              <div className="text-3xl font-bold">Coming Soon</div>
              <p className="text-blue-100 text-sm">
                {isSubscribed && hasScores
                  ? "You're all set! Keep logging scores to stay in the draw."
                  : isSubscribed
                    ? "Log your scores to participate in the next draw"
                    : "Subscribe and log your scores to participate"}
              </p>
            </div>
          </div>

          {/* Charity Impact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Your Impact</h2>
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  £{totalCharityImpact.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">
                  Total donated to your charity
                </p>
              </div>
              {isSubscribed && (
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      £{monthlyContribution.toFixed(2)}
                    </span>{" "}
                    per month ({userProfile?.charity_pct || 10}% of your
                    subscription)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Checklist */}
      {!isSubscribed || !hasScores || !hasCharity ? (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-xl font-bold mb-4">Complete Your Setup</h3>
          <div className="space-y-3">
            <div
              className={`flex items-center gap-3 ${
                isSubscribed ? "opacity-50" : ""
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSubscribed
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isSubscribed && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="font-medium">
                {isSubscribed ? "✓ Subscribed" : "Subscribe to a plan"}
              </span>
              {!isSubscribed && (
                <Link
                  href="/dashboard/subscription"
                  className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Subscribe →
                </Link>
              )}
            </div>

            <div
              className={`flex items-center gap-3 ${
                hasCharity ? "opacity-50" : ""
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  hasCharity
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 bg-white"
                }`}
              >
                {hasCharity && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="font-medium">
                {hasCharity ? "✓ Charity selected" : "Select your charity"}
              </span>
              {!hasCharity && (
                <Link
                  href="/dashboard/charity"
                  className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Choose →
                </Link>
              )}
            </div>

            <div
              className={`flex items-center gap-3 ${
                hasScores ? "opacity-50" : ""
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  hasScores
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 bg-white"
                }`}
              >
                {hasScores && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="font-medium">
                {hasScores ? "✓ Scores logged" : "Log your golf scores"}
              </span>
              {!hasScores && (
                <Link
                  href="/dashboard/scores"
                  className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add scores →
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-bold mb-2">You&apos;re All Set!</h3>
          <p className="text-green-100">
            Keep logging your scores and watch your impact grow. Good luck in
            the next draw!
          </p>
        </div>
      )}
    </div>
  );
}
