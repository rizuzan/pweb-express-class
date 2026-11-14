const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { mkdtempSync, rmSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const testDirectory = mkdtempSync(path.join(os.tmpdir(), 'tugas-api-produk-'));
process.env.PRODUCTS_DB_PATH = path.join(testDirectory, 'test.db');

const app = require('../app');
const db = require('../database');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  db.close();
  rmSync(testDirectory, { recursive: true, force: true });
});

test('GET / serves the product management page', async () => {
  const response = await fetch(baseUrl);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /Manajemen Produk/);
});

test('GET /products returns persisted starter products', async () => {
  const response = await fetch(`${baseUrl}/products`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [
    { id: 1, name: 'Pulpen', price: 5000 },
    { id: 2, name: 'Buku Tulis', price: 12000 },
    { id: 3, name: 'Spidol', price: 8000 },
    { id: 4, name: 'Penggaris', price: 6000 },
    { id: 5, name: 'Penghapus', price: 3000 },
  ]);
});

test('POST /products creates a product and GET /products/:id retrieves it', async () => {
  const response = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Penggaris', price: 7000 }),
  });

  assert.equal(response.status, 201);
  const createdProduct = await response.json();
  assert.deepEqual(createdProduct, { id: 6, name: 'Penggaris', price: 7000 });

  const getResponse = await fetch(`${baseUrl}/products/${createdProduct.id}`);
  assert.equal(getResponse.status, 200);
  assert.deepEqual(await getResponse.json(), createdProduct);
});

test('rejects invalid product data', async () => {
  const response = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '   ', price: -1 }),
  });

  assert.equal(response.status, 400);
});

test('rejects null and malformed JSON request bodies', async () => {
  const nullBodyResponse = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'null',
  });
  assert.equal(nullBodyResponse.status, 400);

  const malformedBodyResponse = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  });
  assert.equal(malformedBodyResponse.status, 400);
});

test('PUT /products updates an existing product by body id', async () => {
  const response = await fetch(`${baseUrl}/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 6, name: 'Penggaris Besi', price: 9000 }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { id: 6, name: 'Penggaris Besi', price: 9000 });
});

test('DELETE /products/:id removes an existing product', async () => {
  const response = await fetch(`${baseUrl}/products/6`, { method: 'DELETE' });

  assert.equal(response.status, 200);

  const getResponse = await fetch(`${baseUrl}/products/6`);
  assert.equal(getResponse.status, 404);
});
