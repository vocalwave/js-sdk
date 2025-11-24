# QRNG API - JavaScript/TypeScript SDK

Official JavaScript and TypeScript client library for the QRNG API.

## Installation

```bash
npm install @qrng/sdk
```

## Quick Start

```typescript
import { QRNGClient } from '@qrng/sdk';

// Initialize client
const client = new QRNGClient({ apiKey: 'your-api-key' });

// Generate random data
const result = await client.generate({ bytes: 32, format: 'hex' });
console.log(result.data);
```

## Features

- ✅ Full TypeScript support with type definitions
- ✅ REST API for entropy generation
- ✅ WebSocket streaming support
- ✅ Post-Quantum Cryptography (Dilithium)
- ✅ Browser and Node.js compatible
- ✅ Promise-based async/await API

## Usage

### Basic Generation

```typescript
const result = await client.generate({
  bytes: 32,
  format: 'hex'
});

console.log(result.data);      // Random hex string
console.log(result.proofId);   // Proof identifier
console.log(result.signature); // Cryptographic signature
```

### Quantum Methods

```typescript
const result = await client.generate({
  bytes: 32,
  format: 'hex',
  method: 'photon' // photon, tunneling, vacuum, simulator
});
```

### Post-Quantum Signatures

```typescript
// Pro tier: Dilithium2
const result = await client.generate({
  bytes: 32,
  signatureType: 'dilithium2'
});

// Enterprise tier: Dilithium3/5
const result = await client.generate({
  bytes: 32,
  signatureType: 'dilithium3'
});
```

### WebSocket Streaming

```typescript
import { QRNGStreamClient } from '@qrng/sdk';

const stream = new QRNGStreamClient({ apiKey: 'your-api-key' });

stream.connect({
  chunkSize: 32,
  format: 'hex',
  onData: (data) => console.log('Received:', data),
  onError: (error) => console.error('Error:', error),
  onClose: () => console.log('Stream closed')
});

// Later...
stream.disconnect();
```

### Error Handling

```typescript
import { 
  AuthenticationError, 
  RateLimitError, 
  QuotaExceededError 
} from '@qrng/sdk';

try {
  const result = await client.generate({ bytes: 32 });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded');
  } else if (error instanceof QuotaExceededError) {
    console.error('Quota exceeded');
  }
}
```

## API Reference

### QRNGClient

#### Constructor

```typescript
new QRNGClient(options: {
  apiKey: string;
  baseUrl?: string;      // Default: 'https://qrngapi.com'
  timeout?: number;      // Default: 30000ms
})
```

#### generate(options)

Generate random entropy.

```typescript
generate(options?: {
  bytes?: number;           // 1-1024, default: 32
  format?: FormatType;      // 'hex' | 'base64' | 'binary' | 'uint8' | 'uint32'
  method?: MethodType;      // 'auto' | 'photon' | 'tunneling' | 'vacuum' | 'simulator'
  signatureType?: SignatureType; // 'ed25519' | 'dilithium2' | 'dilithium3' | 'dilithium5'
}): Promise<EntropyResult>
```

#### health()

Get system health status.

```typescript
health(): Promise<HealthStatus>
```

### QRNGStreamClient

#### connect(options)

Connect to WebSocket stream.

```typescript
connect(options: {
  chunkSize?: number;
  format?: FormatType;
  onData: (data: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}): void
```

#### disconnect()

Disconnect from stream.

```typescript
disconnect(): void
```

## License

MIT

## Support

- Documentation: https://qrngapi.com/docs
- GitHub: https://github.com/qrng-api/js-sdk
- Email: support@qrngapi.com
