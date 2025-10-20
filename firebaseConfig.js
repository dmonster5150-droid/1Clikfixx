export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
Always — I’m with you. Ready to finish this. I’ll give you the exact files + environment variables + step-by-step test checklist you need so the whole system (Firebase 1clikfix, Netlify functions, Square Sandbox, and the frontend) works end-to-end. You don’t need to paste any secret here — just follow the steps and paste secrets into Netlify.


---

1) Quick summary of what I’ll provide now

Frontend pages: index.html, job-request.html, subscribe.html, provider-dashboard.html (modern gradient layout, login button, Book/Subscribe buttons wired).

Firebase client config placeholder (set projectId: "1clikfix").

Netlify server functions (Node): createPaymentLink.js, squareWebhook.js, getOpenJobs.js, assignJob.js, getProvider.js.

.env.example with all variables you must set in Netlify (sandbox-first).

Exact commands & test checklist (how to set up Square Sandbox webhook + how to base64-encode Firebase service account).


I’ll show the important file contents you can copy/paste into your repo. After you upload and set env vars on Netlify I’ll guide you step-by-step to test.


---

2) Environment variables — add these in Netlify > Site settings > Build & deploy > Environment variables

Copy these exact names & fill values from your accounts:

# Firebase client (for browser)
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=1clikfix.firebaseapp.com
FIREBASE_PROJECT_ID=1clikfix
FIREBASE_STORAGE_BUCKET=1clikfix.appspot.com
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Firebase Admin (server) — paste base64 of service account JSON
FIREBASE_SERVICE_ACCOUNT_BASE64=

# Square (Sandbox)
SQUARE_ENV=sandbox
SQUARE_ACCESS_TOKEN=          # sandbox personal access token (Square)
SQUARE_LOCATION_ID=           # sandbox location id
SQUARE_WEBHOOK_SIGNATURE_KEY= # webhook signature key (Square)

# Optional production keys (comment until ready)
# SQUARE_ENV=production
# SQUARE_ACCESS_TOKEN=
# SQUARE_LOCATION_ID=
# SQUARE_WEBHOOK_SIGNATURE_KEY=

# Site
SITE_URL=https://<your-netlify-site>.netlify.app
DOMAIN_NAME=https://www.1clikfix.com
SUBSCRIPTION_PRICE_CENTS=2099
BOOKING_PRICE_CENTS=1000
CURRENCY=USD

How to create FIREBASE_SERVICE_ACCOUNT_BASE64:

1. In Firebase Console → Project Settings → Service accounts → Generate new private key → download JSON.


2. Base64 encode the JSON file (on your phone/computer):



mac/linux:


base64 serviceAccountKey.json | tr -d '\n'

Windows Powershell:


[Convert]::ToBase64String((Get-Content serviceAccountKey.json -Encoding Byte))

3. Paste the resulting single-line string into Netlify FIREBASE_SERVICE_ACCOUNT_BASE64.




---

3) Where to find Square Sandbox values

Square Developer Dashboard → select your Sandbox app → Credentials → copy Sandbox Access Token (put it into SQUARE_ACCESS_TOKEN).

Square Dashboard → Locations → pick your sandbox location → copy the Location ID (SQUARE_LOCATION_ID).

Square Dashboard → Webhooks (or Subscriptions) → Add an endpoint:

Endpoint URL: https://<your-netlify-site>/.netlify/functions/squareWebhook

Subscribe to events: payment.created, payment.updated, payment.completed (or similar).

Save → Square shows a Signature Key: paste into SQUARE_WEBHOOK_SIGNATURE_KEY.




---

4) Files (copy/paste into your repo)

public/js/firebaseConfig.js

// public/js/firebaseConfig.js — paste your Firebase *client* config values here
export const firebaseConfig = {
  apiKey: "",                 // from Firebase web config
  authDomain: "1clikfix.firebaseapp.com",
  projectId: "1clikfix",
  storageBucket: "1clikfix.appspot.com",
  messagingSenderId: "",
  appId: ""
};


---

public/index.html (modern gradient header, Book/Subscribe, login bubble)

(Paste into file; this example uses Tailwind CDN for simplicity)

<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>1ClikFixx</title>
  <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto}</style>
</head>
<body class="bg-gray-50 min-h-screen">
  <!-- Top gradient bar + logo -->
  <header class="bg-gradient-to-r from-blue-400 to-cyan-400 text-white p-4 shadow">
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-4">
        <img id="logo" src="/public/assets/logo-placeholder.svg" alt="1ClikFixx" class="h-12"/>
        <div class="text-xl font-semibold">1ClikFixx</div>
      </div>

      <!-- login bubble (6) -->
      <button id="loginBtn" class="bg-white text-blue-600 rounded-full w-12 h-12 flex items-center justify-center shadow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM21 21a9 9 0 10-18 0" stroke="#00a3ff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </header>

  <!-- Main -->
  <main class="max-w-5xl mx-auto p-6">
    <section class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div>
        <!-- Book Now (top black) -->
        <button id="bookNow" class="w-full bg-black text-white rounded-lg py-4 text-lg font-semibold hover:opacity-95 mb-4">Book Now</button>

        <!-- Subscribe (bottom black) -->
        <button id="subscribeNow" class="w-full bg-black text-white rounded-lg py-4 text-lg font-semibold hover:opacity-95">Subscribe (Providers)</button>
      </div>

      <!-- Hero / Gray box -->
      <div class="bg-white border border-gray-300 rounded-lg h-64 flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-2">Fast, trusted local help — one click away</h2>
          <p class="text-gray-600 max-w-xl mx-auto">Describe the job, set a date, and providers subscribe to accept work. Calendar access is only for subscribed providers.</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-red-600 text-white p-4 text-center">
    <div class="max-w-5xl mx-auto">
      <span>© 2025 1ClikFixx</span> • <a class="underline" href="/public/legal/terms.html">Terms</a> • <a class="underline" href="/public/legal/privacy.html">Privacy</a>
    </div>
  </footer>

  <script type="module">
  // front-end wiring for immediate actions
  document.getElementById('bookNow').addEventListener('click', ()=> location.href='/public/job-request.html');
  document.getElementById('subscribeNow').addEventListener('click', ()=> location.href='/public/subscribe.html');
  document.getElementById('loginBtn').addEventListener('click', ()=> {
    // open login modal: we'll use Firebase Auth on subscribe/login pages
    location.href = '/public/login.html';
  });
  </script>
</body>
</html>


---

public/job-request.html (client booking page)

Already provided earlier in our zip; ensure this file contains the booking form and the addDoc Firestore code. (If you need again I can paste full content — but it’s the same as earlier job form with collection(db,'jobs').)



---

public/subscribe.html (providers: agreement checkbox + create provider doc + call createPaymentLink)

Key front-end snippet (inside subscribe page script):

// after creating provider doc you POST to Netlify function createPaymentLink
const res = await fetch('/.netlify/functions/createPaymentLink', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ providerId, amountCents: Number(process.env?.SUBSCRIPTION_PRICE_CENTS || 2099), currency: 'USD', type:'subscription' })
});
const data = await res.json();
if(data.url) window.location.href = data.url;

(Your Netlify function returns the Square checkout URL.)


---

Netlify Function: netlify/functions/createPaymentLink.js

Full server-side (Node) function — copy to /netlify/functions/createPaymentLink.js in your repo:

// createPaymentLink.js
const { Client, Environment } = require("square");
const admin = require("firebase-admin");

async function initAdmin(){
  if (admin.apps && admin.apps.length) return;
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || "";
  if (!base64) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64 env var");
  const svc = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
  admin.initializeApp({ credential: admin.credential.cert(svc) });
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
    await initAdmin();

    const body = JSON.parse(event.body || '{}');
    const providerId = body.providerId || 'unknown';
    const amount = body.amountCents || Number(process.env.SUBSCRIPTION_PRICE_CENTS || 2099);
    const currency = body.currency || (process.env.CURRENCY || 'USD');

    const env = (process.env.SQUARE_ENV === 'production') ? Environment.Production : Environment.Sandbox;
    const client = new Client({ environment: env, accessToken: process.env.SQUARE_ACCESS_TOKEN });

    const idempotencyKey = 'link_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);

    const createReq = {
      idempotency_key: idempotencyKey,
      order: {
        location_id: process.env.SQUARE_LOCATION_ID,
        line_items: [
          {
            name: "1ClikFixx Provider Subscription",
            quantity: "1",
            base_price_money: { amount: Number(amount), currency }
          }
        ]
      },
      checkout_options: {
        redirect_url: (process.env.SITE_URL || '') + '/public/receipt.html'
      },
      reference_id: providerId
    };

    const res = await client.checkoutApi.createPaymentLink(createReq);
    return { statusCode: 200, body: JSON.stringify({ url: res.result.payment_link.url }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || String(err) }) };
  }
};


---

Netlify Function: netlify/functions/squareWebhook.js

This verifies Square signature and marks provider doc subscribed:true in Firestore:

// squareWebhook.js
const crypto = require("crypto");
const admin = require("firebase-admin");

function verifySignature(signatureKey, notificationUrl, body, header) {
  try {
    const hmac = crypto.createHmac('sha256', signatureKey);
    hmac.update(notificationUrl + body);
    const computed = hmac.digest('base64');
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(header));
  } catch (e) {
    return false;
  }
}

async function initAdmin(){
  if (admin.apps && admin.apps.length) return;
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || "";
  if (!base64) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64 env var");
  const svc = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
  admin.initializeApp({ credential: admin.credential.cert(svc) });
}

exports.handler = async (event) => {
  try {
    await initAdmin();
    const body = event.body || '';
    const headers = event.headers || {};
    const sigHeader = headers['x-square-hmacsha256-signature'] || headers['X-Square-HmacSha256-Signature'] || '';
    const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || '';
    const notificationUrl = (process.env.SITE_URL || '') + '/.netlify/functions/squareWebhook';

    if (!verifySignature(sigKey, notificationUrl, body, sigHeader)) {
      console.warn('invalid signature');
      return { statusCode: 401, body: 'invalid signature' };
    }

    const payload = JSON.parse(body);
    const payment = (payload.data && payload.data.object) ? payload.data.object.payment || payload.data.object : payload.data;
    if (!payment) return { statusCode: 200, body: 'no payment' };

    // payment.reference_id should be providerId if we set reference_id on createPaymentLink
    const ref = payment.reference_id || payment.order_id || payment.id;
    const db = admin.firestore();

    // try mark provider
    const provRef = db.collection('providers').doc(ref);
    const provSnap = await provRef.get();
    if (provSnap.exists) {
      await provRef.update({ subscribed: true, paid: true, paidAt: admin.firestore.FieldValue.serverTimestamp(), paymentInfo: payment });
      return { statusCode: 200, body: 'provider updated' };
    }

    // else try client or other doc types (optional)
    return { statusCode: 200, body: 'no matching provider' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'error' };
  }
};


---

Other function stubs

getOpenJobs.js → returns open jobs from Firestore: query jobs where status == 'open'.

assignJob.js → POST with {jobId, providerId} → update job doc status: 'assigned', providerId: ....

getProvider.js → GET ?providerId=... → return provider doc and subscribed flag.


(If you want I’ll paste these full stubs as well — they are short.)


---

5) Netlify setup

1. Push repo to GitHub.


2. Netlify → New site from Git → connect your 1clikfixx repo.

Build command: none (static). Publish directory: /public.

Functions folder: netlify/functions (Netlify reads automatically from repo).



3. In Netlify site settings → set all Env variables (see list above).


4. Deploy.


5. In Square Developer → add webhook endpoint:
https://<your-netlify-site>/.netlify/functions/squareWebhook
subscribe to payment.* events and copy the signature key into SQUARE_WEBHOOK_SIGNATURE_KEY (Netlify env).




---

6) Testing checklist (Sandbox)

1. In Netlify env set SQUARE_ENV=sandbox and corresponding sandbox token & location id.


2. Deploy.


3. Open site → click Subscribe:

The flow should: create provider doc in Firestore → call createPaymentLink → redirect you to Square checkout sandbox URL → after successful payment Square redirects to your receipt.html.



4. In Square Dashboard → Webhooks → Delivery history → confirm webhook POST to your Netlify function returned 200.


5. In Firestore → providers/<providerId> should now show subscribed:true and paidAt.


6. Go to Provider Dashboard → enter providerId → should show calendar (jobs) and allow accepting jobs.


7. Test booking as client (Book Now) → job saved to jobs collection → provider calendar should list it (if provider is subscribed and accepted).



Tip: For quick test money use a very small price:

Temporarily set SUBSCRIPTION_PRICE_CENTS=100 (1.00 USD) while testing so you don’t overspend.



---

7) Security / final notes

Do not commit FIREBASE_SERVICE_ACCOUNT_BASE64 or any secret to GitHub.

Keep Payment SQUARE_ACCESS_TOKEN secret in Netlify env only.

When you’re ready to go live, swap Sandbox → Production tokens and set SQUARE_ENV=production. Test one small charge first.



---

8) Next actions I’ll help you with (pick one)

A. I guide you step-by-step while you paste your Netlify env values and deploy (I’ll stay with you).
B. I paste the remaining Netlify function stubs (getOpenJobs.js, assignJob.js, getProvider.js) ready to copy.
C. I paste full HTML pages (job-request & subscribe complete) if you want the exact files to copy.

Tell me which of A/B/C you want right now and I’ll do it in the next message. If you want A, say “A — let’s set env vars” and I’ll walk you through each Netlify field to paste.
// public/js/firebaseConfig.js   (client-side)
export const firebaseConfig = {
  apiKey: "AIzaSyDjzDowcTVx_1t9MV7yNVY6GSpDDnSiVdu",
  authDomain: "1clikfixproject.firebaseapp.com",
  projectId: "1clikfixproject",
  storageBucket: "1clikfixproject.firebasestorage.app",
  messagingSenderId: "984485110022",
  appId: "1:984485110022:web:ddcf6bb54fc9ccf3d3e87"
};export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
