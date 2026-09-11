-- Migration: Add restaurants, update schema for region, add price/address/hours
-- Run this in Supabase SQL Editor

-- 1. Alter profiles: rename city to region
alter table profiles rename column city to region;

-- 2. Alter restaurants: rename city to region, add new fields
alter table restaurants rename column city to region;
alter table restaurants add column if not exists address text;
alter table restaurants add column if not exists hours text;
alter table restaurants add column if not exists price_range text check (price_range in ('$', '$$', '$$$'));

-- 3. Delete old seed restaurants
delete from restaurants;

-- 4. Insert comprehensive LA & OC restaurant list
insert into restaurants (name, cuisine_slug, neighborhood, region, address, hours, price_range, vibe_tags) values
  -- KOREAN
  ('Yangban Society', 'korean', 'Arts District', 'Los Angeles', '3402 Glendale Blvd, LA', '5pm-11pm', '$$$', array['Sharing', 'Date-worthy', 'Upscale']),
  ('Majordomo', 'korean', 'Silver Lake', 'Los Angeles', '727 N Alameda St, LA', '5pm-10pm', '$$$', array['Bold', 'Sharing', 'Trendy']),
  ('Sogoking', 'korean', 'Koreatown', 'Los Angeles', '419 S Western Ave, LA', '11am-11pm', '$$', array['KBBQ', 'Group-friendly', 'Late-night']),
  ('Min''s Garden', 'korean', 'Koreatown', 'Los Angeles', '3518 W 6th St, LA', '11am-11pm', '$$', array['Casual', 'KBBQ', 'Family']),
  ('Galbijim House', 'korean', 'Orange County', 'Orange County', '17541 Gotham St, Irvine, CA', '11am-10pm', '$$', array['Traditional', 'Family-run']),

  -- JAPANESE
  ('Osen Izakaya', 'japanese', 'Little Tokyo', 'Los Angeles', '127 Japanese Village Plaza, LA', '5pm-11pm', '$$$', array['Casual', 'Late-night', 'Lively']),
  ('Tsujita', 'japanese', 'West LA', 'Los Angeles', '2050 Sawtelle Blvd, LA', '11:30am-9:30pm', '$$', array['Ramen', 'Quick-eats']),
  ('Sugarfish', 'japanese', 'Multiple', 'Los Angeles', 'Locations across LA', '11am-9:30pm', '$$', array['Sushi', 'Modern', 'Fast-casual']),
  ('Goro Ramen', 'japanese', 'Downtown LA', 'Los Angeles', '343 E 1st St, LA', '11am-10pm', '$$', array['Ramen', 'Broth-focused']),
  ('Sushi Gen', 'japanese', 'Little Tokyo', 'Los Angeles', '422 E 2nd St, LA', '11am-9pm', '$$$', array['Omakase', 'Fine-dining']),
  ('Hanamaru Udon', 'japanese', 'Costa Mesa', 'Orange County', '3313 Harbor Blvd, Costa Mesa', '11am-9pm', '$', array['Udon', 'Budget-friendly']),

  -- THAI
  ('Night + Market', 'thai', 'West Hollywood', 'Los Angeles', '9041 Sunset Blvd, LA', '5pm-11pm', '$$', array['Spicy', 'Casual', 'Late-night']),
  ('Lilia Thai', 'thai', 'Mid-City', 'Los Angeles', '5320 Fountain Ave, LA', '11am-10pm', '$$', array['Traditional', 'Family']),
  ('Siam New York', 'thai', 'Downtown', 'Los Angeles', '453 E 2nd St, LA', '11am-10pm', '$$', array['Pad Thai', 'Casual']),
  ('Thai Nakorn', 'thai', 'Orange County', 'Orange County', '5280 E Pacific Coast Hwy, Long Beach', '10am-10pm', '$$', array['Authentic', 'Colorful']),

  -- VIETNAMESE
  ('Pho Kim Long', 'vietnamese', 'Hollywood', 'Los Angeles', '5619 Hollywood Blvd, LA', '10am-10pm', '$', array['Pho', 'Budget', 'Quick']),
  ('Thanh Huong', 'vietnamese', 'Downtown', 'Los Angeles', '440 E 14th St, LA', '10am-9pm', '$', array['Pho', 'Banh Mi', 'Family']),
  ('Wrap & Roll', 'vietnamese', 'Multiple', 'Los Angeles', 'Locations across LA', '10:30am-10pm', '$', array['Fresh Rolls', 'Quick']),
  ('Saigon Sisters', 'vietnamese', 'Orange County', 'Orange County', '6900 Santa Fe Ave, Huntington Park', '10am-10pm', '$', array['Casual', 'Pho']),

  -- CHINESE
  ('Mission Chinese', 'chinese', 'Downtown', 'Los Angeles', '108 E 2nd St, LA', '5pm-10pm', '$$', array['Modern', 'Trendy', 'Mapo Tofu']),
  ('Chengdu Taste', 'chinese', 'San Gabriel', 'Los Angeles', '280 E Main St, San Gabriel', '11am-10pm', '$$', array['Sichuan', 'Spicy', 'Local']),
  ('Gwei Shan Tian', 'chinese', 'Rowland Heights', 'Los Angeles', '17721 Colima Rd, Rowland Heights', '10am-10pm', '$', array['Dim Sum', 'Family']),
  ('Golden Diner', 'chinese', 'Chinatown', 'Los Angeles', '201 N Alameda Ave, LA', '10am-6pm', '$', array['Dim Sum', 'Classic']),

  -- MEXICAN
  ('Mariscos Playa Hermosa', 'mexican', 'Boyle Heights', 'Los Angeles', '4640 E Cesar E Chavez, LA', '11am-11pm', '$$', array['Seafood', 'Casual']),
  ('Guelaguetza', 'mexican', 'Los Feliz', 'Los Angeles', '2928 Rowena Ave, LA', '5pm-11pm', '$$', array['Oaxacan', 'Traditional']),
  ('Republique', 'mexican', 'Los Feliz', 'Los Angeles', '620 N Heliotrope Dr, LA', '7am-7pm', '$$$', array['Bakery', 'Brunch', 'Trendy']),
  ('Casa Vega', 'mexican', 'Sherman Oaks', 'Los Angeles', '18255 Ventura Blvd, Sherman Oaks', '5pm-11pm', '$$', array['Margaritas', 'Classic', 'Late-night']),
  ('Lolita''s Mexican Food', 'mexican', 'Orange County', 'Orange County', '4640 E 2nd St, Long Beach', '10am-10pm', '$', array['Tacos', 'Budget', 'Casual']),

  -- ITALIAN
  ('Republique', 'italian', 'Los Feliz', 'Los Angeles', '620 N Heliotrope Dr, LA', '7am-7pm', '$$$', array['Bakery', 'Upscale']),
  ('Mother', 'italian', 'Arts District', 'Los Angeles', '603 E 5th St, LA', '5pm-11pm', '$$$', array['Pasta', 'Fine-dining']),
  ('Osteria Mozza', 'italian', 'Hollywood', 'Los Angeles', '6602 Melrose Ave, LA', '11:30am-11pm', '$$$', array['Pastas', 'Wine', 'Upscale']),
  ('Pizzeria Beddia', 'italian', 'Downtown', 'Los Angeles', '512 S Hope St, LA', '11am-10pm', '$$', array['Pizza', 'Casual']),
  ('Luna Pizzeria', 'italian', 'Orange County', 'Orange County', '1620 Brookhurst St, Fullerton', '11am-10pm', '$$', array['Neapolitan Pizza']),

  -- INDIAN
  ('Badmaash', 'indian', 'Downtown', 'Los Angeles', '106 E 2nd St, LA', '5pm-11pm', '$$', array['Modern', 'Cocktails', 'Vibrant']),
  ('Naan-Ya', 'indian', 'Silver Lake', 'Los Angeles', '2953 Rowena Ave, LA', '11am-10pm', '$$', array['Street Food', 'Casual']),
  ('Tiffin', 'indian', 'Palms', 'Los Angeles', '9041 S Sepulveda Blvd, LA', '11:30am-10pm', '$$', array['Curry', 'Traditional']),
  ('Ragas', 'indian', 'Orange County', 'Orange County', '7061 Orchard Ave, Long Beach', '11am-10pm', '$$', array['Traditional', 'Family']),

  -- MEDITERRANEAN
  ('Republique', 'mediterranean', 'Los Feliz', 'Los Angeles', '620 N Heliotrope Dr, LA', '7am-7pm', '$$$', array['Modern', 'Trendy']),
  ('Republique Mediterranean', 'mediterranean', 'Hollywood', 'Los Angeles', '6500 Sunset Blvd, LA', '10am-10pm', '$$', array['Greek', 'Casual']),
  ('Gjelina', 'mediterranean', 'Venice', 'Los Angeles', '1429 Abbot Kinney Blvd, Venice', '8am-11pm', '$$', array['Farm-to-table', 'Brunch', 'Beachside']),

  -- AMERICAN
  ('Gwen', 'american', 'Downtown', 'Los Angeles', '801 S Grand Ave, LA', '5:30pm-10pm', '$$$', array['Upscale', 'Modern', 'Seasonal']),
  ('Tar & Roses', 'american', 'Santa Monica', 'Los Angeles', '602 Santa Monica Blvd, Santa Monica', '5:30pm-10pm', '$$$', array['Fine-dining', 'Seafood']),
  ('The Wallace', 'american', 'Los Feliz', 'Los Angeles', '3428 N Verdugo Rd, LA', '5pm-11pm', '$$', array['Gastropub', 'Burgers', 'Craft Beer']),
  ('Republique', 'american', 'Los Feliz', 'Los Angeles', '620 N Heliotrope Dr, LA', '7am-7pm', '$$$', array['Comfort Food', 'Brunch']),
  ('Lou''s Diner', 'american', 'Orange County', 'Orange County', '4101 E Coast Hwy, Corona del Mar', '7am-9pm', '$$', array['Classic Diner', 'Casual']),

  -- FRENCH
  ('L''Artusi', 'french', 'Los Feliz', 'Los Angeles', '2050 Sawtelle Blvd, LA', '5:30pm-10pm', '$$$', array['French-Italian', 'Upscale']),
  ('Petite Trois', 'french', 'Hollywood', 'Los Angeles', '6703 Hollywood Blvd, LA', '7am-10pm', '$$', array['Bistro', 'Casual', 'French']),

  -- FILIPINO
  ('Lumpia Cafe', 'filipino', 'Echo Park', 'Los Angeles', '1639 W Sunset Blvd, LA', '10am-10pm', '$', array['Filipino', 'Casual', 'Budget']),
  ('Narda''s', 'filipino', 'Downtown', 'Los Angeles', '127 Japanese Village Plaza, LA', '11am-9pm', '$$', array['Modern Filipino']),
  ('Maharlika', 'filipino', 'Orange County', 'Orange County', '3420 W Pacific Ave, Long Beach', '11am-10pm', '$$', array['Casual', 'Filipino Fusion'])
on conflict do nothing;
