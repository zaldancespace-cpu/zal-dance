export interface Env {
  YOOKASSA_SHOP_ID: string;
  YOOKASSA_SECRET_KEY: string;
  FRONTEND_URL: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper to create response
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Create YooKassa payment
async function createPayment(request: Request, env: Env) {
  try {
    const body = await request.json() as {
      bookingId: string;
      amount: number;
      description: string;
      customerEmail: string;
      metadata: Record<string, string>;
    };

    console.log('Create payment request:', JSON.stringify(body));

    const { bookingId, amount, description, customerEmail, metadata } = body;

    // Validate required fields
    if (!bookingId || !amount || !customerEmail) {
      console.error('Missing required fields:', { bookingId, amount, customerEmail });
      return jsonResponse({ error: 'Missing required fields: bookingId, amount, customerEmail' }, 400);
    }

    // Create payment in YooKassa
    const auth = btoa(`${env.YOOKASSA_SHOP_ID}:${env.YOOKASSA_SECRET_KEY}`);
    
    const paymentResponse = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': `booking-${bookingId}-${Date.now()}`,
      },
      body: JSON.stringify({
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB',
        },
        confirmation: {
          type: 'redirect',
          return_url: `${env.FRONTEND_URL}/booking-success?bookingId=${bookingId}`,
        },
        capture: true,
        description: description,
        metadata: {
          bookingId,
          ...metadata,
        },
        receipt: {
          customer: {
            email: customerEmail,
          },
          items: [
            {
              description: description,
              quantity: '1',
              amount: {
                value: amount.toFixed(2),
                currency: 'RUB',
              },
              vat_code: 1,
              payment_mode: 'full_payment',
              payment_subject: 'service',
            },
          ],
        },
      }),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('YooKassa error:', paymentResponse.status, errorText);
      return jsonResponse({ 
        error: 'Payment creation failed', 
        details: errorText,
        status: paymentResponse.status 
      }, 400);
    }

    const payment = await paymentResponse.json() as {
      id: string;
      confirmation: { confirmation_url: string };
    };

    return jsonResponse({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation.confirmation_url,
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

// Handle YooKassa webhook
async function handleWebhook(request: Request, env: Env) {
  try {
    const body = await request.json() as {
      event: string;
      object: {
        id: string;
        status: string;
        metadata: {
          bookingId: string;
        };
      };
    };

    console.log('Webhook received:', body.event, body.object?.status);

    // Only process successful payments
    if (body.event === 'payment.succeeded' && body.object?.status === 'succeeded') {
      const { bookingId } = body.object.metadata;
      
      if (bookingId) {
        // Here you would update Firebase and send email
        // For now, we log it - the frontend will poll for status
        console.log(`Payment succeeded for booking: ${bookingId}`);
        
        // TODO: Update Firebase booking status to 'confirmed'
        // TODO: Send confirmation email via EmailJS
      }
    }

    return jsonResponse({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return jsonResponse({ error: 'Webhook processing failed' }, 500);
  }
}

// Check payment status
async function checkPaymentStatus(request: Request, env: Env) {
  const url = new URL(request.url);
  const paymentId = url.searchParams.get('paymentId');

  if (!paymentId) {
    return jsonResponse({ error: 'paymentId required' }, 400);
  }

  try {
    const auth = btoa(`${env.YOOKASSA_SHOP_ID}:${env.YOOKASSA_SECRET_KEY}`);
    
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      return jsonResponse({ error: 'Payment not found' }, 404);
    }

    const payment = await response.json() as {
      id: string;
      status: string;
      paid: boolean;
    };

    return jsonResponse({
      paymentId: payment.id,
      status: payment.status,
      paid: payment.paid,
    });

  } catch (error) {
    console.error('Error checking payment:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Routes
    if (path === '/api/create-payment' && request.method === 'POST') {
      return createPayment(request, env);
    }

    if (path === '/api/webhook' && request.method === 'POST') {
      return handleWebhook(request, env);
    }

    if (path === '/api/payment-status' && request.method === 'GET') {
      return checkPaymentStatus(request, env);
    }

    if (path === '/api/health') {
      return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
    }

    return jsonResponse({ error: 'Not found' }, 404);
  },
};
