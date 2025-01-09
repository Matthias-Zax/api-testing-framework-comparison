import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const createOrderTrend = new Trend('create_order_duration');
const getOrderTrend = new Trend('get_order_duration');
const getInventoryTrend = new Trend('get_inventory_duration');
const deleteOrderTrend = new Trend('delete_order_duration');

export const options = {
  scenarios: {
    // Smoke test
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
    },
    // Load test
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    'create_order_duration': ['p(95)<500'],
    'get_order_duration': ['p(95)<300'],
    'get_inventory_duration': ['p(95)<300'],
    'delete_order_duration': ['p(95)<300'],
    'errors': ['rate<0.1'], // Error rate should be below 10%
  },
};

const BASE_URL = 'https://petstore.swagger.io/v2';
const HEADERS = {
  'Content-Type': 'application/json',
};

export default function () {
  group('Store API Tests', () => {
    // Create Order
    group('Create Order', () => {
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
        { headers: HEADERS }
      );

      createOrderTrend.add(createResponse.timings.duration);

      check(createResponse, {
        'Create Order status is 200': (r) => r.status === 200,
        'Created order has correct status': (r) => r.json('status') === 'placed',
        'Created order has correct petId': (r) => r.json('petId') === 12345,
      }) || errorRate.add(1);

      const orderId = createResponse.json('id');

      // Get Order
      group('Get Order', () => {
        const getResponse = http.get(
          `${BASE_URL}/store/order/${orderId}`,
          { headers: HEADERS }
        );

        getOrderTrend.add(getResponse.timings.duration);

        check(getResponse, {
          'Get Order status is 200': (r) => r.status === 200,
          'Get order returns correct ID': (r) => r.json('id') === orderId,
          'Get order returns correct status': (r) => r.json('status') === 'placed',
        }) || errorRate.add(1);
      });

      // Get Inventory
      group('Get Inventory', () => {
        const inventoryResponse = http.get(
          `${BASE_URL}/store/inventory`,
          { headers: HEADERS }
        );

        getInventoryTrend.add(inventoryResponse.timings.duration);

        check(inventoryResponse, {
          'Get Inventory status is 200': (r) => r.status === 200,
          'Inventory has items': (r) => Object.keys(r.json()).length > 0,
        }) || errorRate.add(1);
      });

      // Delete Order
      group('Delete Order', () => {
        const deleteResponse = http.del(
          `${BASE_URL}/store/order/${orderId}`,
          null,
          { headers: HEADERS }
        );

        deleteOrderTrend.add(deleteResponse.timings.duration);

        check(deleteResponse, {
          'Delete Order status is 200': (r) => r.status === 200,
        }) || errorRate.add(1);

        // Verify deletion
        const verifyResponse = http.get(
          `${BASE_URL}/store/order/${orderId}`,
          { headers: HEADERS }
        );

        check(verifyResponse, {
          'Verify deletion status is 404': (r) => r.status === 404,
        }) || errorRate.add(1);
      });
    });

    sleep(1); // Wait 1 second between iterations
  });
}
