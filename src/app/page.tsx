import Link from "next/link";
import { ArrowRight, Heart, Trophy, Users, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Digital Heros
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#charities"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Charities
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Play Golf.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Change Lives.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Every subscription supports the causes you care about. Track your
              scores, enter monthly draws, and make a real difference with every
              game you play.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
              >
                Start Making an Impact
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-400 transition-all"
              >
                See How It Works
              </Link>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  £125K+
                </div>
                <div className="text-gray-600 mt-2">Raised for Charity</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  2,500+
                </div>
                <div className="text-gray-600 mt-2">Active Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  12
                </div>
                <div className="text-gray-600 mt-2">Partner Charities</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  £15K
                </div>
                <div className="text-gray-600 mt-2">Last Prize Pool</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple to Join, Powerful Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four easy steps to start playing, winning, and changing lives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Choose Your Charity</h3>
              <p className="text-gray-600">
                Select a cause that matters to you. Every subscription
                contributes at least 10% to your chosen charity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Track Your Scores</h3>
              <p className="text-gray-600">
                Log your last 5 Stableford scores. Your scores automatically
                enter you into the monthly draw.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Enter Monthly Draws</h3>
              <p className="text-gray-600">
                Match 3, 4, or 5 numbers to win prizes. The more you play, the
                better your chances.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">4. Make a Difference</h3>
              <p className="text-gray-600">
                Watch your contributions grow while enjoying the chance to win.
                It&apos;s golf with purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Charity Focus */}
      <section
        id="charities"
        className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Support Causes That Matter
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from 12 carefully vetted charities making real impact in
              communities across the UK
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Children's Hope",
                focus: "Education & Healthcare",
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Ocean Conservation",
                focus: "Environmental Protection",
                color: "from-green-500 to-teal-500",
              },
              {
                name: "Mental Health Matters",
                focus: "Community Support",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Food Bank Network",
                focus: "Fighting Hunger",
                color: "from-orange-500 to-red-500",
              },
              {
                name: "Wildlife Rescue",
                focus: "Animal Welfare",
                color: "from-emerald-500 to-green-500",
              },
              {
                name: "Cancer Research",
                focus: "Medical Research",
                color: "from-pink-500 to-rose-500",
              },
            ].map((charity, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  className={`h-2 w-16 rounded-full bg-gradient-to-r ${charity.color} mb-4`}
                ></div>
                <h3 className="text-xl font-bold mb-2">{charity.name}</h3>
                <p className="text-gray-600">{charity.focus}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/charities"
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2"
            >
              View All Charities
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works for you. Both include full access and
              charity contributions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-all">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Monthly</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">£10</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Monthly prize draw entry</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Track up to 5 scores</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Min 10% to charity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <Link
                  href="/auth/signup"
                  className="block w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>

            <div className="border-2 border-blue-500 rounded-2xl p-8 relative shadow-xl">
              <div className="absolute top-0 right-8 -translate-y-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Best Value
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Yearly</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold">£100</span>
                  <span className="text-gray-600">/year</span>
                </div>
                <p className="text-green-600 font-semibold mb-6">
                  Save £20 (2 months free)
                </p>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Monthly prize draw entry</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Track up to 5 scores</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Min 10% to charity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link
                  href="/auth/signup"
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of golfers supporting amazing causes while enjoying
            the thrill of monthly prize draws.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">
                Digital Heros
              </div>
              <p className="text-sm">
                Playing golf with purpose. Making a difference one score at a
                time.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#charities"
                    className="hover:text-white transition-colors"
                  >
                    Charities
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/auth/signin"
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2024 Digital Heros. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
