1clikfix — Phase 1 Booking + Calendar (no image uploads)

Features:
- Google-only sign-in (via Firebase Auth)
- Service selection (reads from Firestore `services`; falls back to built-in list if empty)
- Booking form saves to Firestore `bookings` collection
- Booking document fields include status: "pending" | "in-progress" | "complete"
- Real-time calendar/dashboard using Firestore onSnapshot
- Protected routes for booking, calendar, profile

How to deploy:
1. Set Firebase values in Netlify environment variables from .env.example.
2. Ensure Google sign-in is enabled in Firebase Console (Auth -> Sign-in method -> Google).
3. Push to GitHub and connect to Netlify, or upload project directly.
4. Build command: npm run build, publish: dist

Firestore notes:
- Collection `services` (optional): documents with field `name` (string). If empty, UI uses built-in service list.
- Collection `bookings`: each doc contains userId, userName, userEmail, service, description, date, time, status, createdAt
