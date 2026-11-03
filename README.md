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
