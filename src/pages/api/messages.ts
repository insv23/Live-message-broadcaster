import type { APIRoute } from 'astro';
import { messageManager } from '../../lib/messageManager';

function createJsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = () => {
  return createJsonResponse(messageManager.getAllMessages());
};

