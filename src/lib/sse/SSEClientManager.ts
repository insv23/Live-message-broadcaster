import type { SSEClient } from './SSEClient';

export class SSEClientManager {
  private clients: Map<string, SSEClient> = new Map();

  addClient(client: SSEClient): void {
    this.clients.set(client.id, client);
  }

  removeClient(id: string): void {
    this.clients.delete(id);
  }

  broadcastMessage(data: unknown): void {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((client: SSEClient) => {
      try {
        client.controller.enqueue(message);
      } catch (error) {
        console.error(`Error sending message to client ${client.id}:`, error);
        this.removeClient(client.id);
      }
    });
  }
}

export const clientManager = new SSEClientManager();