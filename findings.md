# Findings & Discoveries

## Discovery Answers
- **North Star:** E-commerce site for an artist to sell paintings via social redirection (WA/IG).
- **Integrations:** Supabase (Database & Storage).
- **Source of Truth:** Supabase.
- **Delivery Payload:** Responsive frontend + Artist Admin Panel.
- **Behavioral Rules:**
    - No payment gateway; use Instagram DM / WhatsApp buttons.
    - Aesthetic: Modern minimalist, light colors (Beige/Cream).
    - Branding: Gathers info from `theartcart__259` (Bio placeholder).
    - Logo: Must be dynamic and editable via Admin Panel.
    - Full control via Admin Panel (Pricing, Images, Contact Info).

## Constraints
- Supabase for backend.
- Redirect-only ordering (no automated checkout).
- Light color palette strictly required.
