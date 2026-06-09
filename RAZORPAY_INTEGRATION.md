# Razorpay Payment Integration Guide

## Overview
This guide explains how to implement the Razorpay payment gateway backend integration for the Resume AI Builder.

## Why Razorpay?
- **Best for Indian Market**: Native support for INR
- **Multiple Payment Methods**: UPI, Cards, Net Banking, Wallets, EMI
- **Secure**: PCI DSS Level 1 Compliant
- **Easy Integration**: Simple API, good documentation
- **Webhook Support**: Real-time payment notifications

## Installation

### Step 1: Get Razorpay Credentials
1. Create account at https://dashboard.razorpay.com
2. Get API Key ID and API Secret Key
3. Add to `.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

### Step 2: Install Razorpay SDK
```bash
npm install razorpay
```

## Backend API Endpoints

### 1. Create Payment Order
**Endpoint:** `POST /api/payments/create-order`

**Request Body:**
```json
{
  "amount": 500,           // Amount in paise (₹5 = 500 paise)
  "currency": "INR",
  "planId": "premium-resume",
  "planName": "Premium Resume",
  "userId": "user123",
  "userEmail": "user@example.com"
}
```

**Response:**
```json
{
  "orderId": "order_IluGWxBm9U8zJ8",
  "amount": 500,
  "currency": "INR"
}
```

**Implementation Example (Node.js + Express):**
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, currency, planId, userId, userEmail } = req.body;

    const order = await razorpay.orders.create({
      amount: amount,           // in paise
      currency: currency,
      receipt: `order_${userId}_${Date.now()}`,
      notes: {
        planId: planId,
        userId: userId,
        userEmail: userEmail
      }
    });

    // Store order in database
    await db.orders.create({
      orderId: order.id,
      userId: userId,
      planId: planId,
      amount: amount,
      currency: currency,
      status: 'created',
      createdAt: new Date()
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Verify Payment
**Endpoint:** `POST /api/payments/verify`

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_IluGWxBm9U8zJ8",
  "razorpay_order_id": "order_IluGWxBm9U8zJ8",
  "razorpay_signature": "9ef4dffbfd84f1318f6739...",
  "planId": "premium-resume",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "purchaseId": "purchase_123",
  "planId": "premium-resume"
}
```

**Implementation Example:**
```javascript
const crypto = require('crypto');

app.post('/api/payments/verify', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planId,
      userId
    } = req.body;

    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Fetch payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Create purchase record
    const purchase = await db.purchases.create({
      userId: userId,
      planId: planId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: payment.amount,
      currency: payment.currency,
      status: 'success',
      purchasedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    // Update user permissions
    await db.users.updatePlan(userId, planId);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      purchaseId: purchase.id,
      planId: planId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Get User Purchases
**Endpoint:** `GET /api/payments/purchases`

**Response:**
```json
{
  "purchases": [
    {
      "id": "purchase_123",
      "planId": "premium-resume",
      "planName": "Premium Resume",
      "amount": 3000,
      "currency": "INR",
      "purchasedAt": "2024-04-19T10:30:00Z",
      "expiresAt": "2024-05-19T10:30:00Z",
      "status": "active"
    }
  ]
}
```

### 4. Refund Payment
**Endpoint:** `POST /api/payments/refund/:paymentId`

**Response:**
```json
{
  "success": true,
  "refundId": "rfnd_IluGWxBm9U8zJ8",
  "message": "Refund initiated"
}
```

## Webhook Integration (Optional but Recommended)

Listen for Razorpay webhooks to handle payment updates:

```javascript
app.post('/webhooks/razorpay', express.raw({type: 'application/json'}), (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (shasum === req.headers['x-razorpay-signature']) {
    const event = req.body;
    
    if (event.event === 'payment.authorized') {
      // Handle authorized payment
    } else if (event.event === 'payment.failed') {
      // Handle failed payment
    }
  }
  
  res.json({ received: true });
});
```

## Environment Variables (.env)

```env
# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=webhook_secret

# Database
DATABASE_URL=your_database_url

# Server
NODE_ENV=development
```

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  orderId VARCHAR(255) UNIQUE,
  userId VARCHAR(255),
  planId VARCHAR(255),
  amount INT,
  currency VARCHAR(10),
  status VARCHAR(50),
  createdAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Purchases Table
```sql
CREATE TABLE purchases (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255),
  planId VARCHAR(255),
  paymentId VARCHAR(255),
  orderId VARCHAR(255),
  amount INT,
  currency VARCHAR(10),
  status VARCHAR(50),
  purchasedAt TIMESTAMP,
  expiresAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## Testing

### Test Credentials
- **Test Key ID**: `rzp_test_1DP5gbNptzeJ5G`
- **Test Key Secret**: Ask on Razorpay dashboard

### Test Card Numbers
- **Success**: 4111111111111111
- **Failure**: 4000000000000002
- **Expiry**: Any future date
- **CVV**: Any 3 digits

## Security Best Practices

1. **Never expose API secret** in frontend code
2. **Always verify signatures** before creating purchase records
3. **Use HTTPS** for all payment requests
4. **Store payment IDs** for audit trail
5. **Implement refund logic** for 30-day guarantee
6. **Log all transactions** for debugging

## References

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Orders API](https://razorpay.com/docs/api/orders/)
- [Razorpay Payments API](https://razorpay.com/docs/api/payments/)
- [Integration Checklist](https://razorpay.com/docs/integration-checklist/)
