# DocuBridge

A Next.js starter for a legitimate document-preparation and digital-tools platform.

## Included
- Responsive landing page and service catalogue
- USD pay-per-document pricing presentation
- Application-preparation and photo-assistance service positioning
- Customer and admin workspace roadmap
- Crypto checkout architecture notes for BTC, USDT TRC20/ERC20, and USDC on Arc only

## Run locally
1. Install Node.js 20+
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:3000

## Important
This is a starter project, not a production-ready service. Authentication, database persistence, real document rendering, blockchain payment verification, monitoring, and hosting must be configured and tested before accepting orders or payments.

DocuBridge must not create counterfeit government passports, licences, national identity cards, or fabricated proof-of-address documents. Supported services are application assistance, checklists, photo preparation, legitimate employee/membership/event ID cards, and clearly marked sample layouts.

## Crypto implementation requirements
Never collect seed phrases, private keys, or wallet passwords. WalletConnect connects customer wallets; merchant receiving addresses are configured server-side as public addresses only. Verify chain, token contract, recipient, amount, transaction status, and confirmations on the backend before releasing downloads. Accept only BTC, USDT TRC20, USDT ERC20, and USDC on Arc. Do not silently accept other networks or assets.


## Supabase setup
1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Run `supabase/schema.sql` in the Supabase SQL Editor.
4. In Supabase Authentication URL settings, allow your local and production `/auth/callback` URLs.
5. Keep email confirmation enabled. The service-role key, if used by later server-only jobs, must never be exposed in client-side code.

Customer sign-up/sign-in and a protected dashboard are implemented but require Supabase configuration. Orders are not yet created or paid by the application. Payment verification must be server-side before any file is released.
