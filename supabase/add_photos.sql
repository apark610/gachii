-- Add photo_url column to profiles table
ALTER TABLE profiles ADD COLUMN photo_url text;

-- Create a bucket for profile photos (run in Supabase console if this doesn't work)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

-- Create policy to allow users to upload their own photos
-- (Storage policies need to be set in Supabase dashboard)
