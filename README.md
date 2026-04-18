# Digital Heros 🎯⛳

A subscription-based golf + charity + draw platform that combines the excitement of monthly prize draws with meaningful charitable giving.

## 🌟 Overview

Digital Heros is a full-stack web application where golf enthusiasts can:
- Subscribe monthly or yearly
- Track their last 5 Stableford scores
- Enter monthly prize draws based on their scores
- Support their chosen charity with customizable contribution percentages
- Win prizes through random or weighted draw systems

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router) - Server-side rendering and routing
- **TypeScript** - Type safety throughout the application
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Shadcn/ui** - Accessible component primitives
- **Recharts** - Data visualization for analytics

### Backend
- **Next.js Route Handlers** - API endpoints
- **Supabase (PostgreSQL)** - Database with Row Level Security
- **NextAuth.js v5** - Authentication and session management
- **Stripe** - Subscription payments and billing
- **Resend + React Email** - Transactional emails

### DevOps
- **Vercel** - Deployment and hosting
- **Zod** - Runtime validation
- **ESLint** - Code linting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account (test mode)
- Resend account (optional for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ThakurSanskarSingh/DigitalHeros.git
   cd digital_hero
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in the required values in `.env.local`:
   - Supabase credentials (from your Supabase project settings)
   - Stripe API keys (from Stripe dashboard)
   - NextAuth secret (generate with `npx auth secret`)

4. **Set up the database**
   
   Run the migrations in your Supabase SQL editor:
   ```bash
   # Execute the contents of:
   supabase/migrations/20240520000000_initial_schema.sql
   supabase/seed.sql
   ```

5. **Configure Stripe**
   - Create two subscription products in Stripe (Monthly and Yearly)
   - Copy the price IDs to your `.env.local`
   - Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Add webhook signing secret to `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
digital_hero/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth routes
│   │   │   └── webhooks/      # Stripe webhooks
│   │   ├── auth/              # Auth pages (signin, signup)
│   │   ├── dashboard/         # User dashboard
│   │   └── admin/             # Admin panel
│   ├── lib/
│   │   ├── auth/              # NextAuth configuration
│   │   ├── supabase/          # Supabase clients
│   │   ├── stripe/            # Stripe utilities
│   │   ├── validations/       # Zod schemas
│   │   ├── db/                # Database types
│   │   └── utils/             # Utility functions
│   └── components/            # React components
├── supabase/
│   ├── migrations/            # Database migrations
│   └── seed.sql               # Seed data
└── public/                    # Static assets
```

## 🎯 Core Features

### 1. Authentication & Subscription
- Email/password authentication via NextAuth.js
- Stripe integration for monthly/yearly subscriptions
- Subscription lifecycle management
- Protected routes with middleware

### 2. Score Management
- Store exactly 5 rolling scores (1-45 Stableford)
- Automatic replacement of oldest score
- Date validation (no duplicates)
- Reverse chronological display

### 3. Monthly Draw System
- **Random Mode**: Equal chance for all participants
- **Weighted Mode**: More frequent players get higher chances
- Match detection (3, 4, or 5 numbers)
- Jackpot rollover for 5-match prizes
- Simulation before publishing

### 4. Prize Pool
- Auto-calculated from active subscribers
- Distribution:
  - 5-match: 40% (with rollover)
  - 4-match: 35%
  - 3-match: 25%
- Equal split for multiple winners

### 5. Charity Integration
- Select charity at signup
- Minimum 10% contribution
- Adjustable contribution percentage
- Charity directory with profiles
- Event listings per charity

### 6. User Dashboard
- Subscription status and management
- Score entry interface
- Charity selection
- Draw participation history
- Winnings tracker

### 7. Admin Panel
- User and subscription management
- Draw configuration and simulation
- Charity CRUD operations
- Winner verification workflow
- Analytics and reporting

## 🗄️ Database Schema

### Core Tables
- **users** - User profiles and charity preferences
- **subscriptions** - Stripe subscription data
- **scores** - Golf scores (max 5 per user)
- **charities** - Charity organizations
- **draws** - Monthly draw configurations
- **draw_entries** - User entries with score snapshots
- **winner_verifications** - Winner proof submissions
- **charity_events** - Charity event listings

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure authentication via Supabase Auth

## 🎨 UI/UX Principles

- **Emotion-driven design** - Focus on charity impact, not golf clichés
- **Clean and modern** - Minimal, professional interface
- **Mobile-first** - Responsive across all devices
- **Micro-interactions** - Smooth animations with Framer Motion
- **Strong CTAs** - Clear subscription flow

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests (when implemented)
npm run test:e2e
```

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
- Set all `.env.local` variables in Vercel
- Update `AUTH_URL` and `NEXT_PUBLIC_APP_URL` to production domain
- Use production Stripe keys
- Configure Stripe webhook for production endpoint

## 🔐 Security Considerations

- Never expose service role keys to the client
- Use RLS policies for all database operations
- Validate all inputs with Zod schemas
- Rate limit sensitive endpoints
- Implement CSRF protection
- Regular security audits

## 📈 Roadmap

### Phase 1 (Week 1) - ✅ In Progress
- [x] Project setup and configuration
- [x] Authentication system
- [x] Database schema
- [x] Stripe integration
- [ ] Basic UI components

### Phase 2 (Week 2)
- [ ] Score management system
- [ ] Charity directory
- [ ] Homepage and marketing pages

### Phase 3 (Week 3)
- [ ] Draw engine implementation
- [ ] Prize pool calculations
- [ ] User dashboard

### Phase 4 (Week 4)
- [ ] Admin panel
- [ ] Winner verification
- [ ] Email notifications
- [ ] Testing and polish

## 🤝 Contributing

This is a training project. Contributions are not currently accepted.

## 📄 License

Private project - All rights reserved.

## 🆘 Support

For issues or questions, contact: [Your Email]

---

**Built with ❤️ for golfers who care about making a difference**