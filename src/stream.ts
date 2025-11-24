/**
 * QRNG API WebSocket streaming client
 */

import WebSocket from 'ws';
import { QRNGClientOptions, StreamOptions } from './types';
import { QRNGError } from './errors';

export class QRNGStreamClient {
  private apiKey: string;
  private baseUrl: string;
  private ws: WebSocket | null = null;

  constructor(options: QRNGClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl || 'wss://qrngapi.com').replace(/^http/, 'ws');
  }

  /**
   * Connect to WebSocket stream
   */
  connect(options: StreamOptions): void {
    const {
      chunkSize = 32,
      format = 'hex',
      onData,
      onError,
      onClose
    } = options;

    const url = `${this.baseUrl}/api/stream?chunkSize=${chunkSize}&format=${format}`;

    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      this.ws!.send(JSON.stringify({ apiKey: this.apiKey }));
    });

    this.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.error) {
          if (onError) {
            onError(new QRNGError(message.error));
          }
        } else if (message.data) {
          onData(message.data);
        }
      } catch (error) {
        if (onError) {
          onError(error as Error);
        }
      }
    });

    this.ws.on('error', (error) => {
      if (onError) {
        onError(new QRNGError(error.message));
      }
    });

    this.ws.on('close', () => {
      if (onClose) {
        onClose();
      }
    });
  }

  /**
   * Disconnect from stream
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
