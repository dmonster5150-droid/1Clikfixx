const { Client, Environment } = require("square");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };
    const body = JSON.parse(event.body || "{}");
    const providerId = body.providerId;
    if(!providerId) return { statusCode: 400, body: "providerId required" };

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
        redirect_url: body.redirectUrl || (process.env.SITE_URL + "/index.html")
      },
      reference_id: providerId
    };

    const res = await client.checkoutApi.createPaymentLink(createPaymentLinkBody);
    const url = res.result && res.result.payment_link && res.result.payment_link.url;

    return { statusCode: 200, body: JSON.stringify({ url }) };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || err }) };
  }
};