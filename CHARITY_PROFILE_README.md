# Charity Profile Page - Implementation Guide

## Overview

Individual charity profile pages have been implemented at `/charities/[slug]`, allowing users to view detailed information about each charity, see their events, and select them as their preferred charity.

## Features Implemented

### ✅ Core Features

1. **Dynamic Routing** - Individual pages for each charity using slug-based routing
2. **Charity Information Display**
   - Hero section with charity logo and name
   - Full charity description
   - Website link (opens in new tab)
   - Featured badge for featured charities

3. **User Interaction**
   - "Select This Charity" button (requires authentication)
   - Updates user profile in real-time
   - Shows "Your Selected Charity" badge when already selected
   - Redirects to sign-in if not authenticated

4. **Impact Stats Section**
   - Placeholder stats with beautiful gradient icons
   - Metrics: Total Raised, Lives Impacted, Efficiency Rate, Years Active
   - Ready for real data integration

5. **Events Section**
   - Fetches and displays charity events from `charity_events` table
   - Shows event images, dates, titles, and descriptions
   - Graceful handling when no events exist
   - Limited to 6 most recent events

6. **Beautiful Design**
   - Gradient backgrounds (blue → purple → pink)
   - Framer Motion animations throughout
   - Responsive design for all screen sizes
   - Hover effects and micro-interactions
   - Glass-morphism effects

7. **Navigation**
   - Back button to `/charities` listing page
   - Sticky navigation bar

8. **Error Handling**
   - Custom 404 page for non-existent charities
   - Loading states with skeleton UI
   - Error messages for failed charity selection
   - Proper handling of inactive charities

## File Structure

```
digital_hero/src/app/charities/[slug]/
├── page.tsx                      # Server component (data fetching)
├── CharityProfileClient.tsx      # Client component (UI & interactions)
├── loading.tsx                   # Loading state with skeleton UI
└── not-found.tsx                 # Custom 404 page

digital_hero/src/app/api/user/charity/
└── route.ts                      # API endpoint for charity selection
```

## How It Works

### 1. Server-Side Data Fetching (`page.tsx`)

```typescript
// Fetches charity by slug
async function getCharityBySlug(slug: string)

// Fetches charity events
async function getCharityEvents(charityId: string)

// Generates metadata for SEO
export async function generateMetadata()

// Main page component
export default async function CharityProfilePage()
```

**Process:**
1. Extracts slug from URL params
2. Fetches charity data from Supabase
3. Returns 404 if charity not found or inactive
4. Fetches related events
5. Checks if user is authenticated and if charity is already selected
6. Passes all data to client component

### 2. Client-Side Interactions (`CharityProfileClient.tsx`)

**Features:**
- Framer Motion animations
- "Select This Charity" button with loading states
- Error handling and display
- Event cards with image support
- Impact statistics cards
- Responsive layout

**Charity Selection Flow:**
1. User clicks "Select This Charity"
2. If not authenticated → redirect to `/auth/signin`
3. If authenticated → call `/api/user/charity` with PATCH request
4. Update UI on success
5. Refresh page to update session

### 3. API Endpoint (`/api/user/charity/route.ts`)

**Endpoint:** `PATCH /api/user/charity`

**Request Body:**
```json
{
  "charityId": "uuid-string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully selected [Charity Name]",
  "charityId": "uuid-string"
}
```

**Authentication:** Required (checks NextAuth session)

**Validation:**
- Verifies user is authenticated
- Validates charity ID is valid UUID
- Checks charity exists and is active
- Updates user's `charity_id` in database

## Database Schema

### Tables Used

**`charities`**
```sql
- id (UUID)
- name (TEXT)
- slug (TEXT) -- Used for URL routing
- description (TEXT)
- logo_url (TEXT, nullable)
- website_url (TEXT, nullable)
- is_featured (BOOLEAN)
- is_active (BOOLEAN)
```

**`charity_events`**
```sql
- id (UUID)
- charity_id (UUID) -- Foreign key to charities
- title (TEXT)
- description (TEXT, nullable)
- event_date (DATE, nullable)
- image_url (TEXT, nullable)
- created_at (TIMESTAMPTZ)
```

**`users`**
```sql
- id (UUID)
- charity_id (UUID, nullable) -- Foreign key to charities
- charity_pct (INTEGER) -- Percentage to donate
```

## Usage Examples

### Navigating to a Charity Profile

From the charities listing page:
```tsx
<Link href={`/charities/${charity.slug}`}>
  Learn More
</Link>
```

### Direct URL Access
```
https://yourdomain.com/charities/cancer-research-uk
https://yourdomain.com/charities/save-the-children
```

### Programmatic Navigation
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push(`/charities/${charitySlug}`);
```

## Styling & Animations

### Gradient Colors Used
- **Primary:** `from-blue-600 to-purple-600`
- **Background:** `from-blue-50 via-purple-50 to-pink-50`
- **Stats:** Individual gradients for each stat card
- **Success:** `from-green-500 to-emerald-500`
- **Featured Badge:** `from-yellow-400 to-orange-400`

### Animation Variants
- **Initial Load:** Fade in from bottom with stagger effect
- **Hover:** Scale transform on cards
- **Buttons:** Shadow expansion on hover
- **Logo:** Scale animation on mount
- **Navigation:** Translate on arrow icons

## Dependencies

All dependencies are already in the project:

```json
{
  "framer-motion": "^12.38.0",
  "next": "16.2.4",
  "next-auth": "^5.0.0-beta.31",
  "@supabase/ssr": "^0.10.2",
  "@supabase/supabase-js": "^2.103.3",
  "lucide-react": "^1.8.0"
}
```

## Testing Checklist

- [ ] Navigate to `/charities/[valid-slug]` - should load charity profile
- [ ] Navigate to `/charities/invalid-slug` - should show 404 page
- [ ] Click "Back to Charities" - should navigate to `/charities`
- [ ] Click "Select This Charity" (not authenticated) - should redirect to sign-in
- [ ] Click "Select This Charity" (authenticated) - should update user profile
- [ ] Verify selected charity shows "Your Selected Charity" badge
- [ ] Click website link - should open in new tab
- [ ] Check mobile responsiveness
- [ ] Verify all animations work smoothly
- [ ] Test with charity that has no events
- [ ] Test with charity that has no logo

## SEO Optimization

Metadata is automatically generated:
- **Title:** `[Charity Name] | Digital Hero`
- **Description:** First 160 characters of charity description
- **Open Graph:** Includes title, description, and logo image

## Future Enhancements

### Recommended Improvements

1. **Real Impact Stats**
   - Connect to actual donation data
   - Show real-time fundraising progress
   - Display number of active supporters

2. **Donation History**
   - Show user's contribution to this charity
   - Total donated over time
   - Impact milestones

3. **Social Sharing**
   - Share charity profile on social media
   - Generate referral links
   - Social proof (X users support this charity)

4. **Enhanced Events**
   - Event registration
   - Add to calendar functionality
   - Event categories/tags
   - Pagination for more than 6 events

5. **Media Gallery**
   - Photos from charity work
   - Video testimonials
   - Before/after impact photos

6. **Reviews & Testimonials**
   - User reviews
   - Impact stories
   - Beneficiary testimonials

7. **Comparison Feature**
   - Compare multiple charities
   - Side-by-side stats
   - Help users choose

8. **Donation Tracking**
   - Real-time donation counter
   - Fundraising goals
   - Progress bars

## Troubleshooting

### Charity Not Found
**Issue:** Getting 404 even though charity exists
**Solution:** 
- Check `is_active` is `true` in database
- Verify slug matches exactly (case-sensitive)
- Ensure charity exists in database

### Selection Not Working
**Issue:** "Select This Charity" button doesn't work
**Solution:**
- Check user is authenticated
- Verify `/api/user/charity` endpoint is accessible
- Check browser console for errors
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in environment

### Events Not Showing
**Issue:** Events section is empty but events exist
**Solution:**
- Verify `charity_id` in events matches charity `id`
- Check RLS policies on `charity_events` table
- Ensure events are ordered by `event_date`

### Images Not Loading
**Issue:** Charity logo or event images not displaying
**Solution:**
- Verify image URLs are valid and accessible
- Check Next.js image domains in `next.config.js`
- Ensure images are publicly accessible

## Support

For issues or questions:
1. Check this README
2. Review the implementation files
3. Check browser console for errors
4. Verify database schema matches expectations
5. Test with sample data from `supabase/seed.sql`

---

**Built with ❤️ for Digital Hero**