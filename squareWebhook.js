const crypto = require("crypto");

function verifySignature(signatureKey, notificationUrl, body, headerSignature) {
  const hmac = crypto.createHmac('sha256', signatureKey);
  hmac.update(notificationUrl + body);
  const computed = hmac.digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(headerSignature));
  } catch(e) {
    return false;
  }
}

exports.handler = async (event) => {
  try {
    const body = event.body || '';
    const signature = event.headers['x-square-hmacsha256-signature'] || event.headers['X-Square-HmacSha256-Signature'] || '';
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || '';
    const notificationUrl = (process.env.SITE_URL || '') + '/.netlify/functions/squareWebhook';
    if(!verifySignature(signatureKey, notificationUrl, body, signature)){
      console.warn('Invalid webhook signature');
      return { statusCode: 401, body: 'Invalid signature' };
    }
    const payload = JSON.parse(body);
    console.log('Webhook payload:', JSON.stringify(payload));
    if(payload.type && payload.type.includes('payment')){
      const payment = payload.data && payload.data.object && (payload.data.object.payment || payload.data.object);
      if(payment && (payment.status === 'COMPLETED' || payment.status === 'CAPTURED')){
        console.log('Payment completed for reference_id:', payment.reference_id || payment.order_id || payment.id);
        // TODO: Update provider record in DB (Firestore/Supabase) to set verified:true
      }
    }
    return { statusCode: 200, body: 'OK' };
  } catch(err){
    console.error('Webhook error', err);
    return { statusCode: 500, body: 'Server error' };
  }
};