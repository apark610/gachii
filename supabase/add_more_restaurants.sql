-- Add more restaurants to Los Angeles and Irvine

INSERT INTO restaurants (name, cuisine_slug, neighborhood, region, address, hours, price_range) VALUES
-- LOS ANGELES - KOREAN
('Sogoking', 'korean', 'Koreatown', 'Los Angeles', '3465 W 8th St, LA', '11am-11pm', '$$'),
('Han Bat Kalguksu', 'korean', 'Koreatown', 'Los Angeles', '3805 W Olympic Blvd, LA', '10:30am-10pm', '$'),
('Jjim Gal Nyeong', 'korean', 'Koreatown', 'Los Angeles', '3920 W 8th St, LA', '11am-11pm', '$'),

-- LOS ANGELES - JAPANESE
('Ramen Yokocho', 'japanese', 'Little Tokyo', 'Los Angeles', '127 Japanese Village Plaza, LA', '11am-10pm', '$'),
('Sugarfish', 'japanese', 'Downtown LA', 'Los Angeles', '415 S Olive St, LA', '11am-10pm', '$$'),
('Nobu', 'japanese', 'Malibu', 'Los Angeles', '22706 Pacific Coast Hwy, Malibu', '5:30pm-10pm', '$$$'),

-- LOS ANGELES - THAI
('Khao Soi', 'thai', 'Los Feliz', 'Los Angeles', '4625 Hollywood Blvd, LA', '11am-10pm', '$$'),
('Pad Thai Cafe', 'thai', 'Echo Park', 'Los Angeles', '1514 Echo Park Ave, LA', '11am-9:30pm', '$'),

-- LOS ANGELES - VIETNAMESE
('Pho 2000', 'vietnamese', 'Downtown LA', 'Los Angeles', '1102 N Hill St, LA', '9am-9pm', '$'),
('Em Sushi & Pho', 'vietnamese', 'Hollywood', 'Los Angeles', '6643 Hollywood Blvd, LA', '11am-10pm', '$$'),

-- LOS ANGELES - CHINESE
('Din Tai Fung', 'chinese', 'Arcadia', 'Los Angeles', '1108 S Baldwin Ave, Arcadia', '10:30am-10pm', '$$'),
('Peking Duck House', 'chinese', 'Chinatown', 'Los Angeles', '959 N Broadway, LA', '11am-10:30pm', '$$'),

-- LOS ANGELES - MEXICAN
('Guelaguetza', 'mexican', 'Hollywood', 'Los Angeles', '6284 Hollywood Blvd, LA', '11am-11pm', '$$'),
('Republique', 'mexican', 'Los Feliz', 'Los Angeles', '6415 N Figueroa St, LA', '8am-10pm', '$$'),

-- LOS ANGELES - ITALIAN
('Mother', 'italian', 'Arts District', 'Los Angeles', '651 S Mateo Dr, LA', '11am-10pm', '$$'),
('Gjelina', 'italian', 'Venice', 'Los Angeles', '1429 Abbot Kinney Blvd, Venice', '11am-11pm', '$$'),

-- LOS ANGELES - INDIAN
('Tiffin Indian Cuisine', 'indian', 'West LA', 'Los Angeles', '11601 Wilshire Blvd, LA', '11:30am-2:30pm, 5pm-10pm', '$$'),

-- LOS ANGELES - AMERICAN
('The Grill on the Alley', 'american', 'Beverly Hills', 'Los Angeles', '9457 Wilshire Blvd, Beverly Hills', '11:30am-11pm', '$$$'),
('Bestia', 'american', 'Arts District', 'Los Angeles', '2121 E 7th Pl, LA', '5pm-11pm', '$$'),

-- IRVINE - KOREAN
('Korean Restaurant A', 'korean', 'Irvine Spectrum', 'Irvine', '71 Peach Tree Ln, Irvine', '11am-10pm', '$$'),
('BBQ Madang', 'korean', 'Irvine Spectrum', 'Irvine', '1 Spectrum Pointe, Irvine', '11am-10pm', '$$'),

-- IRVINE - JAPANESE
('Yamada Sushi', 'japanese', 'Irvine Spectrum', 'Irvine', '71 Peach Tree Ln, Irvine', '11am-10pm', '$$'),
('Hanamaru Udon', 'japanese', 'Irvine', 'Irvine', '2800 Michelson Dr, Irvine', '11am-9pm', '$'),

-- IRVINE - THAI
('Lemongrass Thai', 'thai', 'Irvine', 'Irvine', '2825 Kelvin Ave, Irvine', '11am-10pm', '$$'),

-- IRVINE - VIETNAMESE
('Pho Tau Bay', 'vietnamese', 'Irvine', 'Irvine', '17842 Von Karman Ave, Irvine', '10am-9:30pm', '$'),

-- IRVINE - CHINESE
('New Dumpling Home', 'chinese', 'Irvine', 'Irvine', '2835 Kelvin Ave, Irvine', '11am-9pm', '$'),

-- IRVINE - MEXICAN
('El Torito', 'mexican', 'Irvine Spectrum', 'Irvine', '1 Spectrum Pointe, Irvine', '11am-11pm', '$$'),

-- IRVINE - ITALIAN
('Cucina Enoteca', 'italian', 'Irvine', 'Irvine', '17882 Von Karman Ave, Irvine', '11:30am-10pm', '$$'),

-- IRVINE - INDIAN
('Tandoor', 'indian', 'Irvine', 'Irvine', '17 Endeavor, Irvine', '11:30am-10pm', '$$'),

-- IRVINE - AMERICAN
('The Cheesecake Factory', 'american', 'Irvine Spectrum', 'Irvine', '1 Spectrum Pointe, Irvine', '11am-11pm', '$$'),

-- IRVINE - MEDITERRANEAN
('Talismano', 'mediterranean', 'Irvine', 'Irvine', '2800 Michelson Dr, Irvine', '11am-10pm', '$$')

ON CONFLICT DO NOTHING;
