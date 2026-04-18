-- Seed Data for Digital Heros
-- Charities with diverse causes

INSERT INTO charities (id, name, slug, description, logo_url, website_url, is_featured, is_active) VALUES
  (
    'c1a1e1b1-1111-4111-8111-111111111111',
    'Children''s Hope Foundation',
    'childrens-hope-foundation',
    'Supporting children in need across the UK through education, healthcare, and family support programs. We believe every child deserves a chance to thrive.',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
    'https://example.com/childrens-hope',
    true,
    true
  ),
  (
    'c1a1e1b1-2222-4222-8222-222222222222',
    'Ocean Conservation Trust',
    'ocean-conservation-trust',
    'Protecting marine life and ocean ecosystems through research, education, and conservation projects. Together we can preserve our oceans for future generations.',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    'https://example.com/ocean-trust',
    true,
    true
  ),
  (
    'c1a1e1b1-3333-4333-8333-333333333333',
    'Mental Health Matters',
    'mental-health-matters',
    'Providing mental health support, counseling services, and awareness campaigns to break the stigma and help those in need across communities.',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400',
    'https://example.com/mental-health',
    true,
    true
  ),
  (
    'c1a1e1b1-4444-4444-8444-444444444444',
    'Food Bank Network UK',
    'food-bank-network-uk',
    'Fighting hunger and food poverty by distributing meals to families and individuals facing hardship. No one should go hungry.',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400',
    'https://example.com/foodbank-uk',
    true,
    true
  ),
  (
    'c1a1e1b1-5555-4555-8555-555555555555',
    'Wildlife Rescue Alliance',
    'wildlife-rescue-alliance',
    'Rescuing, rehabilitating, and releasing injured and orphaned wildlife while protecting natural habitats across the country.',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400',
    'https://example.com/wildlife-rescue',
    false,
    true
  ),
  (
    'c1a1e1b1-6666-4666-8666-666666666666',
    'Elderly Care Foundation',
    'elderly-care-foundation',
    'Enhancing the quality of life for elderly citizens through companionship programs, healthcare support, and community engagement initiatives.',
    'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400',
    'https://example.com/elderly-care',
    false,
    true
  ),
  (
    'c1a1e1b1-7777-4777-8777-777777777777',
    'Education for All',
    'education-for-all',
    'Breaking barriers to education by providing resources, tutoring, and scholarships to underprivileged students across the UK.',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    'https://example.com/education-all',
    false,
    true
  ),
  (
    'c1a1e1b1-8888-4888-8888-888888888888',
    'Homeless Support Initiative',
    'homeless-support-initiative',
    'Offering shelter, meals, job training, and support services to help homeless individuals rebuild their lives with dignity.',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400',
    'https://example.com/homeless-support',
    true,
    true
  ),
  (
    'c1a1e1b1-9999-4999-8999-999999999999',
    'Cancer Research UK Community',
    'cancer-research-uk-community',
    'Funding groundbreaking cancer research and providing support for patients and families affected by cancer across the nation.',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400',
    'https://example.com/cancer-research',
    true,
    true
  ),
  (
    'c1a1e1b1-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Climate Action Now',
    'climate-action-now',
    'Fighting climate change through tree planting, renewable energy projects, and community education programs for a sustainable future.',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    'https://example.com/climate-action',
    false,
    true
  ),
  (
    'c1a1e1b1-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'Domestic Violence Support',
    'domestic-violence-support',
    'Providing safe havens, counseling, legal support, and resources for survivors of domestic violence to rebuild their lives safely.',
    'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400',
    'https://example.com/dv-support',
    false,
    true
  ),
  (
    'c1a1e1b1-cccc-4ccc-8ccc-cccccccccccc',
    'Animal Shelter Alliance',
    'animal-shelter-alliance',
    'Rescuing abandoned and abused animals, providing veterinary care, and finding loving forever homes for pets in need.',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400',
    'https://example.com/animal-shelter',
    false,
    true
  );

-- Sample charity events
INSERT INTO charity_events (charity_id, title, description, event_date, image_url) VALUES
  (
    'c1a1e1b1-1111-4111-8111-111111111111',
    'Annual Fun Run for Kids',
    'Join us for a 5K run to raise funds for children''s education programs. All ages welcome!',
    '2024-06-15',
    'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600'
  ),
  (
    'c1a1e1b1-2222-4222-8222-222222222222',
    'Beach Clean-Up Day',
    'Help us protect marine life by participating in our quarterly beach clean-up event.',
    '2024-07-20',
    'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600'
  ),
  (
    'c1a1e1b1-3333-4333-8333-333333333333',
    'Mental Health Awareness Week',
    'A week of workshops, talks, and activities to promote mental health awareness and support.',
    '2024-05-10',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600'
  ),
  (
    'c1a1e1b1-9999-4999-8999-999999999999',
    'Research Fundraising Gala',
    'An elegant evening of dinner and entertainment to support cancer research initiatives.',
    '2024-09-25',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600'
  );

-- Create an admin user (password should be changed in production)
-- This assumes the auth.users table already has an entry
-- You'll need to create this user through Supabase Auth first, then update the users table
-- Example: INSERT INTO users (id, email, full_name, is_admin, charity_pct)
-- VALUES ('admin-uuid-here', 'admin@digitalheros.com', 'Admin User', true, 10);
