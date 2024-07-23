import { clientManager } from './SSEClientManager';

export function sendSSEToAllClients(data: unknown): void {
  clientManager.broadcastMessage(data);
}