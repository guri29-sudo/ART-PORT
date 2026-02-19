# SOP: Admin Panel & Security

## Goal
Provide the artist with a secure dashboard to manage the site without writing code.

## Access
- **URL:** `/admin`
- **Auth:** Supabase Auth (Email/Password).

## Features
1. **Inventory:** Add/Edit/Delete paintings.
2. **Metadata:** Toggle "Sold" status.
3. **Redirection:** Update WhatsApp/Instagram handles.
4. **Branding:** Update artist bio.

## Security (RLS)
> [!IMPORTANT]
> The `service_role` or specific Auth UID policies must be enabled in Supabase to allow write access to `paintings` and `site_settings`.

## UI/UX
- Consistent with the beige minimalist theme.
- Interactive feedback for CRUD operations.
