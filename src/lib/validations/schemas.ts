import { z } from "zod"

// ==================== Auth Schemas ====================
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  charityId: z.string().uuid("Invalid charity selection"),
  charityPct: z.number().int().min(10).max(100).default(10),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  charityId: z.string().uuid("Invalid charity selection").optional(),
  charityPct: z.number().int().min(10).max(100).optional(),
})

// ==================== Score Schemas ====================
export const scoreSchema = z.object({
  score: z.number().int().min(1).max(45, "Score must be between 1 and 45"),
  playedOn: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
})

export const scoreUpdateSchema = scoreSchema.partial()

// ==================== Charity Schemas ====================
export const charitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  websiteUrl: z.string().url("Invalid website URL").optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

export const charityEventSchema = z.object({
  charityId: z.string().uuid(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10).optional(),
  eventDate: z.coerce.date(),
  imageUrl: z.string().url().optional(),
})

// ==================== Draw Schemas ====================
export const drawConfigSchema = z.object({
  drawDate: z.coerce.date(),
  mode: z.enum(["random", "weighted"]),
})

export const drawNumbersSchema = z.object({
  numbers: z.array(z.number().int().min(1).max(45)).length(5, "Must select exactly 5 numbers"),
})

export const simulateDrawSchema = z.object({
  drawId: z.string().uuid(),
  iterations: z.number().int().min(1).max(1000).default(100),
})

export const publishDrawSchema = z.object({
  drawId: z.string().uuid(),
})

// ==================== Winner Verification Schemas ====================
export const submitProofSchema = z.object({
  entryId: z.string().uuid(),
  proofUrl: z.string().url("Invalid proof URL"),
})

export const reviewProofSchema = z.object({
  verificationId: z.string().uuid(),
  status: z.enum(["approved", "rejected", "paid"]),
  rejectionReason: z.string().min(10).optional(),
})

// ==================== Subscription Schemas ====================
export const createCheckoutSchema = z.object({
  priceId: z.string(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

export const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().uuid(),
  reason: z.string().min(5).optional(),
})

// ==================== Admin Schemas ====================
export const userManagementSchema = z.object({
  userId: z.string().uuid(),
  isAdmin: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export const analyticsFilterSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  metric: z.enum(["subscribers", "revenue", "draws", "charityImpact"]).optional(),
})

// ==================== Query Params Schemas ====================
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const searchSchema = z.object({
  query: z.string().min(1).optional(),
  category: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
})

// ==================== Type Exports ====================
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ScoreInput = z.infer<typeof scoreSchema>
export type CharityInput = z.infer<typeof charitySchema>
export type CharityEventInput = z.infer<typeof charityEventSchema>
export type DrawConfigInput = z.infer<typeof drawConfigSchema>
export type SimulateDrawInput = z.infer<typeof simulateDrawSchema>
export type SubmitProofInput = z.infer<typeof submitProofSchema>
export type ReviewProofInput = z.infer<typeof reviewProofSchema>
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchInput = z.infer<typeof searchSchema>
