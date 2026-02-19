# SOP: Supabase Connection & Configuration

## Goal
Establish a secure connection between the React frontend and the Supabase backend.

## Inputs
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Implementation Steps
1. Create a `.env` file in the root directory.
2. Install `@supabase/supabase-js`.
3. Create a `src/lib/supabaseClient.js` helper.

## Verification
- Run `tools/verify_connection.py` (to be created) or check browser console for successful client initialization.
