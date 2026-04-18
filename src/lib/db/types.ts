// Database Types for Digital Heros

// ==================== Enums ====================
export type SubscriptionPlan = "monthly" | "yearly"

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "trialing"

export type DrawStatus = "draft" | "simulated" | "published"

export type DrawMode = "random" | "weighted"

export type VerificationStatus = "pending" | "approved" | "rejected" | "paid"

// ==================== Database Tables ====================

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  charity_id: string | null
  charity_pct: number
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Charity {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface Score {
  id: string
  user_id: string
  score: number
  played_on: string
  created_at: string
}

export interface Draw {
  id: string
  draw_date: string
  mode: DrawMode
  winning_numbers: number[] | null
  status: DrawStatus
  pool_total: number
  jackpot_rolled: number
  published_at: string | null
  created_at: string
}

export interface DrawEntry {
  id: string
  draw_id: string
  user_id: string
  scores_snapshot: ScoreSnapshot[]
  match_count: number
  prize_amount: number
  created_at: string
}

export interface WinnerVerification {
  id: string
  entry_id: string
  proof_url: string
  status: VerificationStatus
  reviewed_by: string | null
  rejection_reason: string | null
  paid_at: string | null
  created_at: string
}

export interface CharityEvent {
  id: string
  charity_id: string
  title: string
  description: string | null
  event_date: string | null
  image_url: string | null
  created_at: string
}

// ==================== Helper Types ====================

export interface ScoreSnapshot {
  id: string
  score: number
  played_on: string
}

export interface PrizeBreakdown {
  total: number
  fiveMatch: number
  fourMatch: number
  threeMatch: number
  jackpot: number
}

export interface DrawResults {
  drawId: string
  winningNumbers: number[]
  winners: {
    fiveMatch: DrawEntry[]
    fourMatch: DrawEntry[]
    threeMatch: DrawEntry[]
  }
  prizeBreakdown: PrizeBreakdown
}

// ==================== Join Types ====================

export interface UserWithSubscription extends User {
  subscription: Subscription | null
}

export interface UserWithCharity extends User {
  charity: Charity | null
}

export interface DrawWithEntries extends Draw {
  entries: DrawEntry[]
  winnerCount: {
    fiveMatch: number
    fourMatch: number
    threeMatch: number
  }
}

export interface DrawEntryWithUser extends DrawEntry {
  user: Pick<User, "id" | "email" | "full_name" | "avatar_url">
}

export interface VerificationWithEntry extends WinnerVerification {
  entry: DrawEntry & {
    user: Pick<User, "id" | "email" | "full_name">
  }
}

export interface CharityWithEvents extends Charity {
  events: CharityEvent[]
}

// ==================== Analytics Types ====================

export interface SubscriptionStats {
  totalActive: number
  totalMonthly: number
  totalYearly: number
  monthlyRevenue: number
  yearlyRevenue: number
  churnRate: number
}

export interface DrawStats {
  totalDraws: number
  totalPrizesPaid: number
  averagePrizePool: number
  totalWinners: number
  jackpotTotal: number
}

export interface CharityStats {
  totalCharities: number
  totalDonations: number
  averageDonationPercentage: number
  topCharities: Array<{
    charity: Charity
    subscriberCount: number
    totalContribution: number
  }>
}

export interface DashboardAnalytics {
  subscriptions: SubscriptionStats
  draws: DrawStats
  charities: CharityStats
  recentActivity: {
    newSubscribers: number
    newScores: number
    pendingVerifications: number
  }
}

// ==================== API Response Types ====================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ==================== Insert Types (for creating records) ====================

export type UserInsert = Omit<User, "id" | "created_at" | "updated_at">
export type CharityInsert = Omit<Charity, "id" | "created_at" | "updated_at">
export type SubscriptionInsert = Omit<Subscription, "id" | "created_at" | "updated_at">
export type ScoreInsert = Omit<Score, "id" | "created_at">
export type DrawInsert = Omit<Draw, "id" | "created_at">
export type DrawEntryInsert = Omit<DrawEntry, "id" | "created_at">
export type WinnerVerificationInsert = Omit<WinnerVerification, "id" | "created_at">
export type CharityEventInsert = Omit<CharityEvent, "id" | "created_at">

// ==================== Update Types (for updating records) ====================

export type UserUpdate = Partial<Omit<User, "id" | "email" | "created_at">>
export type CharityUpdate = Partial<Omit<Charity, "id" | "created_at">>
export type SubscriptionUpdate = Partial<Omit<Subscription, "id" | "user_id" | "created_at">>
export type ScoreUpdate = Partial<Omit<Score, "id" | "user_id" | "created_at">>
export type DrawUpdate = Partial<Omit<Draw, "id" | "created_at">>
export type DrawEntryUpdate = Partial<Omit<DrawEntry, "id" | "draw_id" | "user_id" | "created_at">>
export type WinnerVerificationUpdate = Partial<Omit<WinnerVerification, "id" | "entry_id" | "created_at">>
export type CharityEventUpdate = Partial<Omit<CharityEvent, "id" | "charity_id" | "created_at">>
