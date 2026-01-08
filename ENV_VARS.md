## Environment variables

### RapidAPI

- **`RAPIDAPI_INSTAGRAM_MASTER_KEY`**: Key for Instagram Master API 2025 (**recommended; used by `/api/scanner/search`**)
- **`RAPIDAPI_CHATGPT_KEY`**: Key for the RapidAPI ChatGPT helper (optional)
- **`RAPIDAPI_KEY`**: Fallback RapidAPI key (used if the specific key above isn’t set)

#### Quick verification

If a RapidAPI request fails, the error message will include which env var was used and the **last 4 characters**
of the key (example: `key=RAPIDAPI_INSTAGRAM_MASTER_KEY…c316`). This helps confirm you’re using the subscribed key
without exposing the full secret.

### Supabase

- **`NEXT_PUBLIC_SUPABASE_URL`**
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
- **`SUPABASE_SERVICE_ROLE_KEY`**


