1Clikfixx - Client Booking (Phase A)

This package contains the client-side app for Phase A:
- Email + Google Auth (Firebase)
- Protected /book, /calendar, /profile pages
- Firestore writes for bookings and user profiles
- jobTypes list for booking dropdown

How to use:
1. Rename .env.example to .env (for local) or set environment variables in Netlify.
2. Run `npm install` then `npm run dev` to preview locally.
3. Deploy to Netlify: build command `npm run build`, publish folder `dist`.

Important: Do NOT commit secret keys for admin service accounts. Client Firebase config is safe to include as env vars.
