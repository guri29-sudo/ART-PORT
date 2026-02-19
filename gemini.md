# Project Constitution (gemini.md)

## Data Schemas

### `paintings` table
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary Key |
| `title` | TEXT | Title of the painting |
| `description` | TEXT | Details about size, medium, etc. |
| `price` | NUMERIC | Listing price |
| `image_url` | TEXT | URL to Supabase Storage asset |
| `status` | STRING | `available` \| `sold` |
| `created_at` | TIMESTAMP | Auto-entry |

### `site_settings` table (Single row)
| Field | Type | Description |
|---|---|---|
| `id` | INT | Primary Key (ID 1) |
| `logo_url` | TEXT | URL to Supabase Storage (Logo) |
| `bio_text` | TEXT | Custom bio for the artist |
| `instagram_username` | TEXT | For redirection link |
| `whatsapp_number` | TEXT | For redirection link |
| `banner_offer_text` | TEXT | Text for sales/offers |
| `is_offer_active` | BOOLEAN | Toggle banner |
| `contact_email` | TEXT | Backup contact |

## Behavioral Rules
- Order button must generate a WhatsApp message link with the product title.
- Admin Panel must gate access (Auth required).
- UI must use Beige (#F5F5DC or similar) as the primary background.
- Admin Users must be created manually in Supabase Dashboard > Authentication > Users.

## Architectural Invariants
- 3-Layer Architecture (Architecture, Navigation, Tools)
- Logic is deterministic (Python scripts)
- Reasoning is external (Navigation layer)
- SOPs must be updated before code changes
