"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";
import { signUpSchema } from "@/lib/validations/schemas";

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  website_url: string | null;
  is_featured: boolean;
}

type SignUpFormData = {
  email: string;
  password: string;
  fullName: string;
  charityId: string;
  charityPct: number;
};

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    fullName: "",
    charityId: "",
    charityPct: 10,
  });
  const [charities, setCharities] = useState<Charity[]>([]);
  const [isLoadingCharities, setIsLoadingCharities] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch charities when moving to step 2
  useEffect(() => {
    if (currentStep === 2 && charities.length === 0) {
      fetchCharities();
    }
  }, [currentStep]);

  const fetchCharities = async () => {
    setIsLoadingCharities(true);
    try {
      const response = await fetch("/api/charities");
      const data = await response.json();

      if (data.charities) {
        setCharities(data.charities);
      } else {
        setError("Failed to load charities");
      }
    } catch (err) {
      setError("Failed to load charities");
    } finally {
      setIsLoadingCharities(false);
    }
  };

  const validateStep = (step: number): boolean => {
    setFieldErrors({});
    setError("");

    try {
      if (step === 1) {
        z.object({
          email: z.string().email("Invalid email address"),
          password: z.string().min(8, "Password must be at least 8 characters"),
          fullName: z.string().min(2, "Name must be at least 2 characters"),
        }).parse({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        });
      } else if (step === 2) {
        z.object({
          charityId: z.string().uuid("Please select a charity"),
        }).parse({
          charityId: formData.charityId,
        });
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            errors[e.path[0].toString()] = e.message;
          }
        });
        setFieldErrors(errors);
        setError(err.errors[0].message);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError("");
    setFieldErrors({});
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Final validation
      const validated = signUpSchema.parse(formData);

      // Call signup API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      // Sign in the user automatically
      const signInResult = await signIn("credentials", {
        email: validated.email,
        password: validated.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(
          "Account created but sign-in failed. Please sign in manually.",
        );
        setTimeout(() => router.push("/auth/signin"), 2000);
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Join Digital Heroes
          </h1>
          <p className="text-gray-600">
            Play, win, and make a difference in the world
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 3 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className="flex-1 h-1 mx-2 bg-gray-200 rounded">
                    <div
                      className={`h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded transition-all duration-300 ${
                        currentStep > step ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Your Info</span>
            <span>Choose Charity</span>
            <span>Set Impact</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Start your journey to becoming a Digital Hero
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      fieldErrors.fullName
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    } focus:ring-2 focus:border-transparent transition-all outline-none`}
                    placeholder="John Doe"
                    required
                  />
                  {fieldErrors.fullName && (
                    <p className="text-red-600 text-xs mt-1">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      fieldErrors.email
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    } focus:ring-2 focus:border-transparent transition-all outline-none`}
                    placeholder="you@example.com"
                    required
                  />
                  {fieldErrors.email && (
                    <p className="text-red-600 text-xs mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      fieldErrors.password
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    } focus:ring-2 focus:border-transparent transition-all outline-none`}
                    placeholder="••••••••"
                    required
                  />
                  {fieldErrors.password && (
                    <p className="text-red-600 text-xs mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Select Charity */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Choose Your Cause
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Select a charity that resonates with your values
                  </p>
                </div>

                {isLoadingCharities ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        className="animate-spin h-10 w-10 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <p className="text-gray-600">Loading charities...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                    {charities.map((charity) => (
                      <label
                        key={charity.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.charityId === charity.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="charity"
                          value={charity.id}
                          checked={formData.charityId === charity.id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              charityId: e.target.value,
                            })
                          }
                          className="mt-1 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800">
                              {charity.name}
                            </h3>
                            {charity.is_featured && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          {charity.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {charity.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {fieldErrors.charityId && (
                  <p className="text-red-600 text-sm">
                    {fieldErrors.charityId}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoadingCharities}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Set Contribution Percentage */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Set Your Impact
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Choose how much of your winnings go to charity
                  </p>
                </div>

                {/* Impact Visualization */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                  <div className="text-center mb-4">
                    <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formData.charityPct}%
                    </div>
                    <p className="text-gray-600 text-sm mt-2">
                      of your winnings will support{" "}
                      {charities.find((c) => c.id === formData.charityId)
                        ?.name || "your chosen charity"}
                    </p>
                  </div>

                  {/* Example Impact */}
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      Example Impact:
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">If you win $1,000</span>
                      <span className="font-bold text-blue-600">
                        ${((formData.charityPct / 100) * 1000).toFixed(0)}{" "}
                        donated
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">If you win $10,000</span>
                      <span className="font-bold text-purple-600">
                        ${((formData.charityPct / 100) * 10000).toFixed(0)}{" "}
                        donated
                      </span>
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Contribution Percentage (minimum 10%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={formData.charityPct}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        charityPct: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(168, 85, 247) ${formData.charityPct}%, rgb(229, 231, 235) ${formData.charityPct}%, rgb(229, 231, 235) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>10%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Motivational Message */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💛</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Every percentage makes a difference
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        You're not just playing to win — you're playing to
                        change lives. Thank you for being a Digital Hero!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 text-sm transition-colors inline-flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to homepage
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
