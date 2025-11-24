/**
 * Error types for QRNG API
 */

export class QRNGError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: Record<string, any>
  ) {
    super(message);
    this.name = 'QRNGError';
  }
}

export class AuthenticationError extends QRNGError {
  constructor(message = 'Invalid API key') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends QRNGError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export class QuotaExceededError extends QRNGError {
  constructor(message = 'Monthly quota exceeded') {
    super(message, 402);
    this.name = 'QuotaExceededError';
  }
}
