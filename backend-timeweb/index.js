require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://zaldance.ru';

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create payment
app.post('/api/create-payment', async (req, res) => {
  try {
    const { bookingId, amount, description, customerEmail, metadata } = req.body;

    console.log('Create payment request:', JSON.stringify(req.body));

    // Validate required fields
    if (!bookingId || !amount || !customerEmail) {
      console.error('Missing required fields:', { bookingId, amount, customerEmail });
      return res.status(400).json({ 
        error: 'Missing required fields: bookingId, amount, customerEmail' 
      });
    }

    // Create payment in YooKassa
    const auth = Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64');
    
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
          return_url: `${FRONTEND_URL}/booking-success?bookingId=${bookingId}`,
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
      return res.status(400).json({ 
        error: 'Payment creation failed', 
        details: errorText,
        status: paymentResponse.status 
      });
    }

    const payment = await paymentResponse.json();

    res.json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation.confirmation_url,
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check payment status
app.get('/api/payment-status', async (req, res) => {
  const { paymentId } = req.query;

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId required' });
  }

  try {
    const auth = Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64');
    
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = await response.json();

    res.json({
      paymentId: payment.id,
      status: payment.status,
      paid: payment.paid,
    });

  } catch (error) {
    console.error('Error checking payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// YooKassa webhook
app.post('/api/webhook', async (req, res) => {
  try {
    const body = req.body;

    console.log('Webhook received:', body.event, body.object?.status);

    // Only process successful payments
    if (body.event === 'payment.succeeded' && body.object?.status === 'succeeded') {
      const { bookingId } = body.object.metadata;
      
      if (bookingId) {
        console.log(`Payment succeeded for booking: ${bookingId}`);
      }
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
