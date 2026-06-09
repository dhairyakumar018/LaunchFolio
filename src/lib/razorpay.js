/**
 * Razorpay Payment Integration
 * 
 * This module handles Razorpay payment gateway integration
 * Razorpay is the best payment solution for Indian market, supporting:
 * - Credit/Debit Cards
 * - UPI (Google Pay, PhonePe, Paytm, etc.)
 * - Net Banking
 * - Digital Wallets
 * - EMI options
 */

/**
 * Create a Razorpay payment order
 * @param {Object} orderData - Order details
 * @param {number} orderData.amount - Amount in paise (e.g., 500 for ₹5)
 * @param {string} orderData.currency - Currency code (e.g., 'INR')
 * @param {string} orderData.planId - ID of the plan being purchased
 * @param {string} orderData.planName - Name of the plan
 * @param {string} orderData.userId - ID of the user making purchase
 * @param {string} orderData.userEmail - Email of the user
 * @returns {Promise<{orderId: string}>} Order ID from Razorpay
 */
export async function createPaymentOrder(orderData) {
  try {
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      throw new Error('Failed to create payment order')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating payment order:', error)
    throw error
  }
}

/**
 * Verify Razorpay payment signature
 * @param {Object} paymentData - Payment response from Razorpay
 * @param {string} paymentData.razorpay_payment_id - Payment ID from Razorpay
 * @param {string} paymentData.razorpay_order_id - Order ID from Razorpay
 * @param {string} paymentData.razorpay_signature - Signature for verification
 * @param {string} paymentData.planId - ID of the purchased plan
 * @param {string} paymentData.userId - ID of the user
 * @returns {Promise<{success: boolean, message: string}>} Verification result
 */
export async function verifyPayment(paymentData) {
  try {
    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(paymentData)
    })

    if (!response.ok) {
      throw new Error('Payment verification failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}

/**
 * Load Razorpay checkout script
 * @returns {Promise<void>}
 */
export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

/**
 * Open Razorpay checkout modal
 * @param {Object} options - Razorpay checkout options
 * @param {string} options.key - Razorpay Key ID
 * @param {number} options.amount - Amount in paise
 * @param {string} options.currency - Currency code
 * @param {string} options.order_id - Order ID from backend
 * @param {Object} options.prefill - User information to prefill
 * @param {Function} options.handler - Callback when payment is successful
 * @returns {void}
 */
export function openCheckout(options) {
  if (!window.Razorpay) {
    throw new Error('Razorpay script not loaded')
  }

  const razorpay = new window.Razorpay(options)
  razorpay.open()
}

/**
 * Format amount from rupees to paise
 * @param {number} amount - Amount in rupees
 * @returns {number} Amount in paise
 */
export function formatAmount(amount) {
  return amount * 100
}

/**
 * Get payment display amount
 * @param {number} amount - Amount in paise
 * @returns {number} Amount in rupees
 */
export function getDisplayAmount(amount) {
  return amount / 100
}
