/**
 * QRNG API REST client
 */

import { QRNGClientOptions, GenerateOptions, EntropyResult, HealthStatus } from './types';
import { QRNGError, AuthenticationError, RateLimitError, QuotaExceededError } from './errors';

export class QRNGClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(options: QRNGClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || 'https://qrngapi.com';
    this.timeout = options.timeout || 30000;
  }

  /**
   * Generate random entropy
   */
  async generate(options: GenerateOptions = {}): Promise<EntropyResult> {
    const {
      bytes = 32,
      format = 'hex',
      method,
      signatureType
    } = options;

    const params = new URLSearchParams({
      bytes: bytes.toString(),
      format,
      ...(method && { method }),
      ...(signatureType && { signatureType })
    });

    const url = `${this.baseUrl}/api/random?${params}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        headers: { 'X-API-Key': this.apiKey },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        throw new AuthenticationError();
      } else if (response.status === 429) {
        throw new RateLimitError();
      } else if (response.status === 402) {
        throw new QuotaExceededError();
      } else if (!response.ok) {
        const data = await response.json().catch(() => ({})) as any;
        throw new QRNGError(
          data.error || `HTTP ${response.status}`,
          response.status,
          data
        );
      }

      const data = await response.json() as any;

      return {
        data: data.data,
        proofId: data.proofId,
        signature: data.signature,
        publicKey: data.publicKey,
        signatureType: data.signatureType,
        metadata: data.metadata || {}
      };
    } catch (error) {
      if (error instanceof QRNGError) {
        throw error;
      }
      throw new QRNGError(`Request failed: ${error}`);
    }
  }

  /**
   * Get system health status
   */
  async health(): Promise<HealthStatus> {
    const url = `${this.baseUrl}/api/health`;

    try {
      const response = await fetch(url, {
        headers: { 'X-API-Key': this.apiKey }
      });

      if (!response.ok) {
        throw new QRNGError(`Health check failed: HTTP ${response.status}`);
      }

      const data = await response.json() as any;

      return {
        status: data.status,
        metrics: data.metrics,
        timestamp: data.timestamp
      };
    } catch (error) {
      if (error instanceof QRNGError) {
        throw error;
      }
      throw new QRNGError(`Health check failed: ${error}`);
    }
  }
}
