const API_BASE = '/api'

export const api = {
  async request(path, options = {}) {
    const token = localStorage.getItem('auth_token')
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const controller = new AbortController()
    const id = setTimeout(() => {
      try {
        console.warn(`Request to ${path} timed out after 45s. Aborting.`);
        controller.abort()
      } catch (e) {
        console.warn('Abort failed', e)
      }
    }, 45000) // Increased to 45s timeout for cold starts

    try {
      console.log(`Starting API request to: ${API_BASE}${path}`);
      const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        signal: controller.signal
      }).catch(err => {
        if (err.name === 'AbortError') {
          throw new Error('The request timed out. This often happens on first load while the server wakes up. Please try again.');
        }
        throw err;
      })
      clearTimeout(id)

      const contentType = response.headers.get('content-type') || ''
      const rawBody = await response.text()

      let data = null
      if (rawBody) {
        if (contentType.includes('application/json')) {
          try {
            data = JSON.parse(rawBody)
          } catch (error) {
            console.error('API response JSON parse error:', error)
          }
        } else {
          try {
            data = JSON.parse(rawBody)
          } catch {
            data = { message: rawBody }
          }
        }
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || rawBody || 'Something went wrong'
        throw new Error(errorMessage)
      }

      return data ?? {}
    } catch (error) {
      clearTimeout(id)
      throw error
    }
  },

  auth: {
    async login(email, password) {
      const data = await api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      return data
    },
    async signup(email, password) {
      const data = await api.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      return data
    },
    logout() {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    },
    getUser() {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    },
    async updateProfile(profileData) {
      const data = await api.request('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
      })
      localStorage.setItem('user', JSON.stringify(data.user))
      return data.user
    },
    async forgotPassword(email) {
      return api.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
    },
    async resetPassword(email, code, newPassword) {
      return api.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, code, newPassword }),
      })
    }
  },

  resumes: {
    async list() {
      return api.request('/resumes')
    },
    async save(resume) {
      return api.request('/resumes', {
        method: 'POST',
        body: JSON.stringify(resume),
      })
    }
  },

  payments: {
    async createOrder(orderData) {
      return api.request('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify(orderData),
      })
    },
    async verifyPayment(paymentData) {
      return api.request('/payments/verify', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      })
    },
    async getPurchases() {
      return api.request('/payments/purchases')
    },
    async refundPayment(paymentId) {
      return api.request(`/payments/refund/${paymentId}`, {
        method: 'POST',
      })
    }
  }
}
