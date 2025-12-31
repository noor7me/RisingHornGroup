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


## Live products via Supabase
Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel.
The site loads products from `/api/products` and shows only rows where `available=true`.


### Supabase environment variables
This project supports either naming convention:
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (recommended)
- or `SUPABASE_URL` + `SUPABASE_ANON_KEY`

In Vercel, add the variables and redeploy.
