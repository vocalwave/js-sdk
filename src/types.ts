/**
 * Type definitions for QRNG API SDK
 */

export type FormatType = 'hex' | 'base64' | 'binary' | 'uint8' | 'uint32';
export type MethodType = 'auto' | 'photon' | 'tunneling' | 'vacuum' | 'simulator';
export type SignatureType = 'ed25519' | 'dilithium2' | 'dilithium3' | 'dilithium5';

export interface QRNGClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface GenerateOptions {
  bytes?: number;
  format?: FormatType;
  method?: MethodType;
  signatureType?: SignatureType;
}

export interface EntropyResult {
  data: string;
  proofId: string;
  signature: string;
  publicKey: string;
  signatureType: string;
  metadata: Record<string, any>;
}

export interface HealthStatus {
  status: string;
  metrics: Record<string, any>;
  timestamp: string;
}

export interface StreamOptions {
  chunkSize?: number;
  format?: FormatType;
  onData: (data: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}
