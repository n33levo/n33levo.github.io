import test from 'node:test';
import assert from 'node:assert/strict';
import { readSSE } from '../src/lib/sse.ts';

function response(chunks) {
  return new Response(new ReadableStream({ start(controller) { for (const chunk of chunks) controller.enqueue(chunk); controller.close(); } }));
}
const bytes = text => new TextEncoder().encode(text);

test('SSE handles single-byte UTF-8 chunks, CRLF, comments, and trailing done', async () => {
  const raw = bytes(': heartbeat\r\n\r\ndata: {"content":"café ☕"}\r\n\r\ndata: {"done":true}');
  const events = [];
  await readSSE(response(Array.from(raw, b => new Uint8Array([b]))), e => events.push(e));
  assert.deepEqual(events, [{content: 'café ☕'}, {done: true}]);
});
test('An abruptly closed stream fails instead of appearing complete', async () => {
  await assert.rejects(readSSE(response([bytes('data: {"content":"partial"}\n\n')]), () => {}), /interrupted/);
});
test('Server errors are not swallowed by JSON parsing', async () => {
  await assert.rejects(readSSE(response([bytes('data: {"error":"unavailable","done":true}\n\n')]), e => { if (e.error) throw new Error(e.error); }), /unavailable/);
});
test('Non-200 detail is shown', async () => {
  await assert.rejects(readSSE(new Response('{"detail":"Please wait"}', {status: 429}), () => {}), /Please wait/);
});
test('Malformed events fail', async () => {
  await assert.rejects(readSSE(response([bytes('data: {broken}\n\n')]), () => {}), SyntaxError);
});

test('Paced rendering callbacks finish in order before the done event', async () => {
  const order = [];
  await readSSE(response([bytes('data: {"content":"one"}\n\ndata: {"content":"two"}\n\ndata: {"done":true}\n\n')]), async event => {
    if (event.content) {
      order.push(`start:${event.content}`);
      await Promise.resolve();
      order.push(`end:${event.content}`);
    } else order.push('done');
  });
  assert.deepEqual(order, ['start:one', 'end:one', 'start:two', 'end:two', 'done']);
});
