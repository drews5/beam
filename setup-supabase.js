import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY; // Using the key you provided

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
    console.log('Attempting to set up mailing_list table...');

    // Note: Supabase JS client doesn't support creating tables directly.
    // However, we can try to "probe" if it exists or use an RPC if one exists.
    // Since this is a fresh project, the most reliable way is for the user to paste SQL 
    // or for me to use the Supabase CLI if installed.

    console.log('\n--- ACTION REQUIRED ---');
    console.log('The Supabase API does not allow creating tables via the standard Javascript library.');
    console.log('Please copy and paste the following SQL into your Supabase SQL Editor:');
    console.log(`
CREATE TABLE IF NOT EXISTS mailing_list (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE mailing_list ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (signups)
CREATE POLICY "Enable insert for everyone" ON mailing_list FOR INSERT WITH CHECK (true);

-- Allow reading (optional, for your admin view)
CREATE POLICY "Enable read for service role" ON mailing_list FOR SELECT USING (true);
    `);
}

setupDatabase();
