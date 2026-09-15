-- Map coordinates + live restaurant search support
-- Run this in the Supabase SQL Editor.

-- Coordinates for map pins
alter table restaurants add column if not exists lat double precision;
alter table restaurants add column if not exists lng double precision;

-- Track where a restaurant came from: the curated seed list, or live Google search
alter table restaurants add column if not exists source text not null default 'curated';

-- Google place_id for restaurants adopted from live search.
-- Unique so the same place is never saved twice.
alter table restaurants add column if not exists external_id text;

-- Plain unique index (not partial): Postgres treats NULLs as distinct, so the
-- curated rows with a null external_id don't collide, and ON CONFLICT can
-- still target this index when adopting a restaurant from live search.
create unique index if not exists restaurants_external_id_key
  on restaurants (external_id);

-- Live-search restaurants are inserted on demand when a user saves one,
-- so authenticated users need insert permission on this table.
alter table restaurants enable row level security;

drop policy if exists "Restaurants are viewable by everyone" on restaurants;
create policy "Restaurants are viewable by everyone" on restaurants
  for select using (true);

drop policy if exists "Authenticated users can add restaurants from search" on restaurants;
create policy "Authenticated users can add restaurants from search" on restaurants
  for insert to authenticated with check (source = 'google');

-- ---------------------------------------------------------------
-- Coordinates for the curated restaurants, geocoded via OpenStreetMap.
-- Only points confirmed to sit inside their stated region AND within
-- 10km of their neighborhood centre are set here. The remaining 19 are
-- left null on purpose: several seed rows have an address and a
-- neighborhood that disagree, and a wrong pin is worse than no pin.
-- Those rows hide the map but keep working Yelp/Directions links.
-- ---------------------------------------------------------------
update restaurants set lat = 34.1202914, lng = -118.2580624 where name = 'Yangban Society';
update restaurants set lat = 34.0558272, lng = -118.2376568 where name = 'Majordomo';
update restaurants set lat = 34.0634945, lng = -118.2988045 where name = 'Min''s Garden';
update restaurants set lat = 34.0492429, lng = -118.2406667 where name = 'Osen Izakaya';
update restaurants set lat = 34.046779, lng = -118.2386861 where name = 'Sushi Gen';
update restaurants set lat = 33.6939903, lng = -117.9196696 where name = 'Hanamaru Udon';
update restaurants set lat = 34.0907141, lng = -118.388813 where name = 'Night + Market';
update restaurants set lat = 34.094956, lng = -118.3053377 where name = 'Lilia Thai';
update restaurants set lat = 34.0474052, lng = -118.2386617 where name = 'Siam New York';
update restaurants set lat = 34.102047, lng = -118.3243975 where name = 'Pho Kim Long';
update restaurants set lat = 34.0508155, lng = -118.2443822 where name = 'Mission Chinese';
update restaurants set lat = 34.0969567, lng = -118.0962734 where name = 'Chengdu Taste';
update restaurants set lat = 34.0406715, lng = -118.1879382 where name = 'Mariscos Playa Hermosa';
update restaurants set lat = 34.1083641, lng = -118.268659 where name = 'Guelaguetza';
update restaurants set lat = 34.0805846, lng = -118.2931263 where name = 'Republique';
update restaurants set lat = 34.1524309, lng = -118.457787 where name = 'Casa Vega';
update restaurants set lat = 34.0833739, lng = -118.3387469 where name = 'Osteria Mozza';
update restaurants set lat = 34.0499457, lng = -118.2557499 where name = 'Pizzeria Beddia';
update restaurants set lat = 34.0508274, lng = -118.2444014 where name = 'Badmaash';
update restaurants set lat = 34.1085691, lng = -118.268781 where name = 'Naan-Ya';
update restaurants set lat = 33.9550347, lng = -118.3960133 where name = 'Tiffin';
update restaurants set lat = 34.0981247, lng = -118.3017576 where name = 'Republique Mediterranean';
update restaurants set lat = 33.9905045, lng = -118.4649582 where name = 'Gjelina';
update restaurants set lat = 34.0455248, lng = -118.2586725 where name = 'Gwen';
update restaurants set lat = 34.0179893, lng = -118.493053 where name = 'Tar & Roses';
update restaurants set lat = 34.1016418, lng = -118.3363227 where name = 'Petite Trois';
update restaurants set lat = 34.0770251, lng = -118.2577393 where name = 'Lumpia Cafe';
update restaurants set lat = 34.0492429, lng = -118.2406667 where name = 'Narda''s';
update restaurants set lat = 34.0532558, lng = -118.3193975 where name = 'Gogi House';
update restaurants set lat = 34.057599, lng = -118.3051424 where name = 'Dae Jang Kum';
update restaurants set lat = 34.0575942, lng = -118.2839147 where name = 'Soot Bul House';
update restaurants set lat = 34.1409723, lng = -118.3871224 where name = 'Katsu-Ya';
update restaurants set lat = 34.0492429, lng = -118.2406667 where name = 'Hamasaku';
update restaurants set lat = 34.0917521, lng = -118.2798205 where name = 'Enoki';
update restaurants set lat = 34.0927533, lng = -118.280401 where name = 'Rhong Tiam';
update restaurants set lat = 34.11097, lng = -118.291924 where name = 'Pestobar Soi 38';
update restaurants set lat = 34.0231205, lng = -118.1705527 where name = 'Banh Mi My Tho';
update restaurants set lat = 34.0666435, lng = -118.2360449 where name = 'China Palace';
update restaurants set lat = 34.0109559, lng = -118.4692518 where name = 'Rickys Fish Tacos';
update restaurants set lat = 34.0916276, lng = -118.2798212 where name = 'Mas Malo';
update restaurants set lat = 34.033738, lng = -118.2293095 where name = 'Bestia';
update restaurants set lat = 34.0107139, lng = -118.4696702 where name = 'Indigo';
update restaurants set lat = 34.0334904, lng = -118.2319059 where name = 'Sycamore Kitchen';
update restaurants set lat = 34.0336546, lng = -118.2319316 where name = 'Three Weld';
update restaurants set lat = 34.081848, lng = -118.3770104 where name = 'Republique Med';
update restaurants set lat = 34.066982, lng = -118.396064 where name = 'Avra';
update restaurants set lat = 34.09809, lng = -118.364614 where name = 'Comme Ca';
update restaurants set lat = 34.0602525, lng = -118.2375763 where name = 'Petit Trois';
update restaurants set lat = 34.0615753, lng = -118.2351302 where name = 'Gamys';
update restaurants set lat = 33.6820374, lng = -117.8364647 where name = 'Seoul Sausage Company';
update restaurants set lat = 33.6874966, lng = -117.8444282 where name = 'Kotobuki';
update restaurants set lat = 33.682978, lng = -117.8360751 where name = 'Pad Thai King';
update restaurants set lat = 33.6707904, lng = -117.8581415 where name = 'Pho Hoa Noodle Soup';
update restaurants set lat = 33.6825489, lng = -117.8357659 where name = 'Saigon Kitchen';
update restaurants set lat = 33.6874966, lng = -117.8444282 where name = 'Keke Shanghai';
update restaurants set lat = 33.682858, lng = -117.835903 where name = 'Taiwan Cafe';
update restaurants set lat = 33.6825071, lng = -117.8357058 where name = 'Casa de Tacos';
update restaurants set lat = 33.6824892, lng = -117.8481534 where name = 'Bacco Ristorante';
update restaurants set lat = 33.6847602, lng = -117.8471532 where name = 'Marcellos';
update restaurants set lat = 33.683098, lng = -117.8362472 where name = 'Curry in a Hurry';
update restaurants set lat = 33.6840075, lng = -117.8479018 where name = 'Claim Jumper';
update restaurants set lat = 33.6874966, lng = -117.8444282 where name = 'Kabuki Restaurant';
update restaurants set lat = 33.6840793, lng = -117.8478304 where name = 'Le Bernardin';
update restaurants set lat = 33.682938, lng = -117.8360177 where name = 'Goldilocks Bakery';
update restaurants set lat = 34.0533181, lng = -118.3190795 where name = 'Han Bat Kalguksu';
update restaurants set lat = 34.0579567, lng = -118.3118353 where name = 'Jjim Gal Nyeong';
update restaurants set lat = 34.0492429, lng = -118.2406667 where name = 'Ramen Yokocho';
update restaurants set lat = 34.0389596, lng = -118.6696041 where name = 'Nobu';
update restaurants set lat = 34.1002433, lng = -118.2901081 where name = 'Khao Soi';
update restaurants set lat = 34.0800848, lng = -118.2551366 where name = 'Pad Thai Cafe';
update restaurants set lat = 34.0566633, lng = -118.244264 where name = 'Pho 2000';
update restaurants set lat = 34.1016543, lng = -118.334385 where name = 'Em Sushi & Pho';
update restaurants set lat = 34.0656638, lng = -118.2368124 where name = 'Peking Duck House';
update restaurants set lat = 34.0671433, lng = -118.3993735 where name = 'The Grill on the Alley';
update restaurants set lat = 33.683018, lng = -117.8361324 where name = 'Lemongrass Thai';
update restaurants set lat = 33.6874966, lng = -117.8444282 where name = 'Pho Tau Bay';
update restaurants set lat = 33.682938, lng = -117.8360177 where name = 'New Dumpling Home';
update restaurants set lat = 33.6839358, lng = -117.8479733 where name = 'Cucina Enoteca';
update restaurants set lat = 33.6665582, lng = -117.7627244 where name = 'Tandoor';
update restaurants set lat = 33.672429, lng = -117.847554 where name = 'Talismano';
update restaurants set lat = 33.750631, lng = -117.8722311 where name = 'Galbijim House';
update restaurants set lat = 33.750631, lng = -117.8722311 where name = 'Luna Pizzeria';
update restaurants set lat = 33.750631, lng = -117.8722311 where name = 'Ragas';
update restaurants set lat = 33.750631, lng = -117.8722311 where name = 'Maharlika';
update restaurants set lat = 34.0536909, lng = -118.242766 where name = 'Patricios';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'Gen Korean BBQ House';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'Santouka Ramen';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'Thai Ginger';
update restaurants set lat = 33.6856969, lng = -117.825981 where name = 'Qdoba Mexican Grill';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'India Palace';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'Dave and Busters';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'Olive Garden';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'Jollibee';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'Korean Restaurant A';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'BBQ Madang';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'Yamada Sushi';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'El Torito';
update restaurants set lat = 33.6542365, lng = -117.747701 where name = 'The Cheesecake Factory';
