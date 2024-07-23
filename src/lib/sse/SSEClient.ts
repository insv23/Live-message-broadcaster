export interface SSEClient {
  id: string;
  controller: ReadableStreamDefaultController;
}