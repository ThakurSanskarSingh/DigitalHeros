-- Initial Schema for Digital Heros
-- Enums
CREATE TYPE subscription_plan AS ENUM ('monthly', 'yearly');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing');
CREATE TYPE draw_status AS ENUM ('draft', 'simulated', 'published');
CREATE TYPE draw_mode AS ENUM ('random', 'weighted');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'paid');

-- 1. Charities Table
CREATE TABLE charities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Users Table (Extending Auth.Users via Trigger or Service Role)
-- Note: NextAuth Supabase Adapter handles some of this, but we need custom fields.
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    charity_id UUID REFERENCES charities(id),
    charity_pct INT2 DEFAULT 10 CHECK (charity_pct >= 10 AND charity_pct <= 100),
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Subscriptions Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    plan subscription_plan NOT NULL,
    status subscription_status NOT NULL,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Scores Table (Rolling 5 scores)
CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    score INT2 NOT NULL CHECK (score >= 1 AND score <= 45),
    played_on DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Ensure no duplicate dates for the same user
    UNIQUE(user_id, played_on)
);

-- 5. Draws Table
CREATE TABLE draws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_date DATE NOT NULL UNIQUE, -- e.g., first of the month
    mode draw_mode DEFAULT 'random',
    winning_numbers INT2[] CHECK (array_length(winning_numbers, 1) = 5),
    status draw_status DEFAULT 'draft',
    pool_total NUMERIC(12, 2) DEFAULT 0,
    jackpot_rolled NUMERIC(12, 2) DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Draw Entries (Snapshot of scores at time of draw)
CREATE TABLE draw_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    scores_snapshot JSONB NOT NULL, -- The 5 scores used for this draw
    match_count INT2 DEFAULT 0,
    prize_amount NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(draw_id, user_id)
);

-- 7. Winner Verifications
CREATE TABLE winner_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID REFERENCES draw_entries(id) ON DELETE CASCADE NOT NULL,
    proof_url TEXT NOT NULL,
    status verification_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Charity Events
CREATE TABLE charity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    charity_id UUID REFERENCES charities(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE winner_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_events ENABLE ROW LEVEL SECURITY;

-- Policies

-- Charities: Public read, Admin write
CREATE POLICY "Charities are viewable by everyone" ON charities FOR SELECT USING (true);
CREATE POLICY "Admin can manage charities" ON charities ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Users: Read own, Admin read all, Update own
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Scores: Read/Write own
CREATE POLICY "Users can manage own scores" ON scores ALL USING (auth.uid() = user_id);

-- Subscriptions: Read own
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Draws: Public read (if published), Admin all
CREATE POLICY "Everyone can view published draws" ON draws FOR SELECT USING (status = 'published');
CREATE POLICY "Admin manage draws" ON draws ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Draw Entries: User read own
CREATE POLICY "Users can view own entries" ON draw_entries FOR SELECT USING (auth.uid() = user_id);

-- Winner Verifications: User read/write own, Admin read/write all
CREATE POLICY "Users can manage own verifications" ON winner_verifications ALL USING (
    EXISTS (SELECT 1 FROM draw_entries WHERE id = entry_id AND user_id = auth.uid())
);
CREATE POLICY "Admin manage all verifications" ON winner_verifications ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Indexes
CREATE INDEX idx_scores_user_date ON scores(user_id, played_on DESC);
CREATE INDEX idx_draw_entries_draw_user ON draw_entries(draw_id, user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
