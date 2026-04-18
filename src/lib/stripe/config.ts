import Stripe from "stripe"
import { loadStripe, type Stripe as StripeJS } from "@stripe/stripe-js"

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

// Client-side Stripe promise
let stripePromise: Promise<StripeJS | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Price IDs from environment
export const STRIPE_PRICES = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!,
  yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!,
}

// Subscription price mapping (in cents)
export const SUBSCRIPTION_PRICES = {
  monthly: 1000, // £10/month
  yearly: 10000, // £100/year (2 months free)
} as const

// Calculate monthly active subscribers for prize pool
export function calculatePrizePool(activeSubscribers: number, jackpotRollover: number = 0): {
  total: number
  fiveMatch: number
  fourMatch: number
  threeMatch: number
  jackpot: number
} {
  const monthlyRevenue = activeSubscribers * 10 // £10 per subscriber
  const total = monthlyRevenue + jackpotRollover

  return {
    total,
    fiveMatch: total * 0.4, // 40%
    fourMatch: total * 0.35, // 35%
    threeMatch: total * 0.25, // 25%
    jackpot: jackpotRollover,
  }
}

// Helper to create checkout session URL
export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  priceId: string
  successUrl: string
  cancelUrl: string
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  })

  if (!session.url) {
    throw new Error("Failed to create checkout session")
  }

  return session.url
}

// Helper to create customer portal session
export async function createPortalSession(customerId: string, returnUrl: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session.url
}
