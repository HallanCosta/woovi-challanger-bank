// Global polyfills for Next.js testing environment
// This file must be imported BEFORE any Next.js modules

// Polyfill for Request
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = init.method || 'GET'
      this.headers = init.headers || {}
      this.body = init.body || null
    }
    
    async json() {
      return JSON.parse(this.body || '{}')
    }
    
    async text() {
      return String(this.body || '')
    }
    
    clone() {
      return new Request(this.url, {
        method: this.method,
        headers: this.headers,
        body: this.body
      })
    }
  }
}

// Polyfill for Response
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = init.headers || {}
      this.ok = this.status >= 200 && this.status < 300
    }
    
    async json() {
      return JSON.parse(this.body || '{}')
    }
    
    async text() {
      return String(this.body || '')
    }
    
    clone() {
      return new Response(this.body, {
        status: this.status,
        statusText: this.statusText,
        headers: this.headers
      })
    }
  }
}

// Polyfill for Headers
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this.map = new Map()
      if (init && typeof init === 'object') {
        Object.entries(init).forEach(([key, value]) => {
          this.set(key, value)
        })
      }
    }
    
    set(key, value) {
      this.map.set(String(key).toLowerCase(), String(value))
    }
    
    get(key) {
      return this.map.get(String(key).toLowerCase()) || null
    }
    
    has(key) {
      return this.map.has(String(key).toLowerCase())
    }
    
    delete(key) {
      this.map.delete(String(key).toLowerCase())
    }
    
    forEach(callback) {
      this.map.forEach((value, key) => callback(value, key, this))
    }
  }
}

// Polyfill for fetch
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() => 
    Promise.resolve(new Response('{}', { status: 200 }))
  )
}

