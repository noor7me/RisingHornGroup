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


## Supabase products
Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.
The site loads products from `/api/products` and falls back to sample products if DB is unavailable.
