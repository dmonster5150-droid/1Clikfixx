// netlify/functions/createPaymentLink.js
const { Client, Environment } = require("square");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    const body = JSON.parse(event.body || "{}");
    const providerId = body.providerId || null;
    if (!providerId) return { statusCode: 400, body: "providerId required" };

    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const env = (process.env.SQUARE_ENV === "production") ? Environment.Production : Environment.Sandbox;
    const client = new Client({ environment: env, accessToken });

    const idempotencyKey = 'link_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);

    const createPaymentLinkBody = {
      idempotency_key: idempotencyKey,
      order: {
        location_id: process.env.SQUARE_LOCATION_ID,
        line_items: [
          {
            name: "1ClikFix Provider Subscription",
            quantity: "1",
            base_price_money: {
              amount: body.amountCents || 2099,
              currency: body.currency || "USD"
            }
          }
        ]
      },
      checkout_options: {
        redirect_url: body.redirectUrl || (process.env.SITE_URL + "/provider-register?paid=true")
      },
      reference_id: providerId
    };

    const res = await client.checkoutApi.createPaymentLink(createPaymentLinkBody);
    const url = res.result && res.result.payment_link && res.result.payment_link.url;

    return {
      statusCode: 200,
      body: JSON.stringify({ url })
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || err }) };
  }
};// after creating provider doc you POST to Netlify function createPaymentLink
const res = await fetch('/.netlify/functions/createPaymentLink', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ providerId, amountCents: Number(process.env?.SUBSCRIPTION_PRICE_CENTS || 2099), currency: 'USD', type:'subscription' })
});
const data = await res.json();
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
}; window.location.href = data.url;
