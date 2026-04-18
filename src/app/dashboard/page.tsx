import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Trophy, TrendingUp, Heart, Calendar, DollarSign, Settings } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Digital Heros
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{user.name || user.email}</span>
              </span>
              <Link
                href="/dashboard/settings"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Track your scores, manage your subscription, and see your impact</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Total Wins</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">0/5</div>
            <div className="text-sm text-gray-600">Scores Logged</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">£0</div>
            <div className="text-sm text-gray-600">Charity Impact</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Draws Entered</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Subscription & Charity */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-600" />
                Subscription Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plan</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    Not Active
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Subscribe to start entering monthly draws and making a difference.
                </p>
                <Link
                  href="/dashboard/subscription"
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>

            {/* Charity Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-gray-600" />
                Your Charity
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Choose a charity to support with your subscription
                </p>
                <Link
                  href="/dashboard/charity"
                  className="block w-full text-center border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:border-gray-400 transition-all"
                >
                  Select Charity
                </Link>
              </div>
            </div>
          </div>

          {/* Middle Column - Scores */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                Your Scores
              </h2>
              <div className="text-center py-12">
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
            </div>
          </div>

          {/* Right Column - Draws & Winnings */}
          <div className="space-y-6">
            {/* Upcoming Draw */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Next Draw
              </h2>
              <div className="space-y-2">
                <div className="text-3xl font-bold">Coming Soon</div>
                <p className="text-blue-100">
                  Subscribe and log your scores to participate in the next monthly draw
                </p>
              </div>
            </div>

            {/* Winnings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-600" />
                Your Winnings
              </h2>
              <div className="text-center py-8">
                <div className="text-5xl mb-2">🏆</div>
                <p className="text-gray-500">No winnings yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Keep playing for your chance to win!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-xl font-bold mb-2">Get Started</h3>
            <p className="text-gray-600 mb-4">
              Complete these steps to participate in your first draw
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span>Subscribe to a plan</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span>Select your charity</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span>Log your golf scores</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6 border border-pink-100">
            <h3 className="text-xl font-bold mb-2">Making an Impact</h3>
            <p className="text-gray-600 mb-4">
              Every subscription makes a real difference
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Your Contribution</span>
                <span className="text-lg font-bold text-pink-600">10%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Donated</span>
                <span className="text-lg font-bold text-pink-600">£0.00</span>
              </div>
              <Link
                href="/dashboard/charity"
                className="block text-center text-pink-600 hover:text-pink-700 font-semibold text-sm mt-4"
              >
                Increase Your Impact →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
