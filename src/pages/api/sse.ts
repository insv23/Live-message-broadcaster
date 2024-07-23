import type { APIRoute } from 'astro';
import type { SSEClient } from '../../lib/sse/SSEClient';
import { clientManager } from '../../lib/sse/SSEClientManager';

export const GET: APIRoute = ({ request }) => {
  const stream = new ReadableStream({
    start(controller) {
      const clientId = crypto.randomUUID();
      const newClient: SSEClient = { id: clientId, controller };

      clientManager.addClient(newClient);

      request.signal.addEventListener('abort', () => {
        clientManager.removeClient(clientId);
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
};