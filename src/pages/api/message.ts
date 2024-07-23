import type { APIRoute } from 'astro';
import { messageManager } from '../../lib/messageManager';
import { sendSSEToAllClients } from '../../lib/sse/broadcastSSE.ts';

interface RequestBody {
  text: string;
}

function isValidRequestBody(body: unknown): body is RequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'text' in body &&
    typeof body.text === 'string'
  );
}

function createJsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (isValidRequestBody(body)) {
    const newMessage = messageManager.addMessage(body.text);
    sendSSEToAllClients(newMessage);
    return createJsonResponse(messageManager.getAllMessages());
  }

  return createJsonResponse({ error: 'Invalid request body' }, 400);
}