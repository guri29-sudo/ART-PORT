import os
from supabase import create_client, Client

# These would normally be in .env
url = "REPLACE_WITH_URL"
key = "REPLACE_WITH_KEY"

def verify():
    try:
        supabase: Client = create_client(url, key)
        # Try to fetch from site_settings (should be empty or have 1 row)
        response = supabase.table("site_settings").select("*").execute()
        print(f"Connection Successful! Rows found: {len(response.data)}")
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    verify()
