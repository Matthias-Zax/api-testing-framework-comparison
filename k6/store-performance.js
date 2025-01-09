import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '20s', target: 20 }, // Ramp up to 20 users over 20 seconds
    { duration: '20s', target: 20 }, // Stay at 20 users for 20 seconds
    { duration: '20s', target: 0 },  // Ramp down to 0 users over 20 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    errors: ['rate<0.1'],             // Error rate should be below 10%
  },
};

const BASE_URL = 'https://petstore.swagger.io/v2';

export default function () {
  // Create a new order
  const newOrder = {
    id: Math.floor(Math.random() * 100000),
    petId: 12345,
    quantity: 1,
    shipDate: new Date().toISOString(),
    status: 'placed',
    complete: false,
  };

  const createResponse = http.post(
    `${BASE_URL}/store/order`,
    JSON.stringify(newOrder),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(createResponse, {
    'Create Order status is 200': (r) => r.status === 200,
    'Created order has correct status': (r) => r.json('status') === 'placed',
  }) || errorRate.add(1);

  const orderId = createResponse.json('id');

  // Get the order
  const getResponse = http.get(`${BASE_URL}/store/order/${orderId}`);
  
  check(getResponse, {
    'Get Order status is 200': (r) => r.status === 200,
    'Get order returns correct ID': (r) => r.json('id') === orderId,
  }) || errorRate.add(1);

  // Get store inventory
  const inventoryResponse = http.get(`${BASE_URL}/store/inventory`);
  
  check(inventoryResponse, {
    'Get Inventory status is 200': (r) => r.status === 200,
    'Inventory has items': (r) => Object.keys(r.json()).length > 0,
  }) || errorRate.add(1);

  // Delete the order
  const deleteResponse = http.del(`${BASE_URL}/store/order/${orderId}`);
  
  check(deleteResponse, {
    'Delete Order status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  // Verify deletion
  const verifyResponse = http.get(`${BASE_URL}/store/order/${orderId}`);
  
  check(verifyResponse, {
    'Verify deletion status is 404': (r) => r.status === 404,
  }) || errorRate.add(1);

  sleep(1); // Wait 1 second between iterations
}
