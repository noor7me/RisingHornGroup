# RisingHorn Group Website

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Pages
- About
- Products
- Order
- Contact
(Home is accessible via the logo.)

## Logo
`public/logo.svg`

## API
- GET /api/health
- POST /api/contact


## Supabase products (optional)
This site can load products from Supabase. If Supabase env vars are not set or your table is empty, the site falls back to sample products in `lib/products.ts`.

### Required Vercel / local env vars
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase table
Create a table named `products` with at least: `sku`, `name`, `category`.
Optional columns: `brand`, `origin`, `size`, `case_pack`, `moq`, `notes`, `image` (or `image_url`), `active` (boolean), `sort_order` (number).
