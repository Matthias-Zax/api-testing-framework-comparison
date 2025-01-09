import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { htmlReport } from "k6-reporter";

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
      duration: '20s',
    },
    // Load test
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 20 },
        { duration: '20s', target: 20 },
        { duration: '20s', target: 0 },
      ],
      gracefulRampDown: '10s',
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

      const startTime = new Date();
      const createResponse = http.post(
        `${BASE_URL}/store/order`,
        JSON.stringify(newOrder),
        { headers: HEADERS }
      );
      createOrderTrend.add(new Date() - startTime);

      check(createResponse, {
        'Create Order status is 200': (r) => r.status === 200,
        'Created order has correct status': (r) => r.json('status') === 'placed',
      }) || errorRate.add(1);

      const orderId = createResponse.json('id');

      // Get Order
      group('Get Order', () => {
        const startTime = new Date();
        const getResponse = http.get(`${BASE_URL}/store/order/${orderId}`);
        getOrderTrend.add(new Date() - startTime);

        check(getResponse, {
          'Get Order status is 200': (r) => r.status === 200,
          'Get Order has correct ID': (r) => r.json('id') === orderId,
        }) || errorRate.add(1);
      });

      // Get Store Inventory
      group('Get Store Inventory', () => {
        const startTime = new Date();
        const inventoryResponse = http.get(`${BASE_URL}/store/inventory`);
        getInventoryTrend.add(new Date() - startTime);

        check(inventoryResponse, {
          'Get Inventory status is 200': (r) => r.status === 200,
          'Inventory response is JSON': (r) => r.headers['Content-Type'].includes('application/json'),
        }) || errorRate.add(1);
      });

      // Delete Order
      group('Delete Order', () => {
        const startTime = new Date();
        const deleteResponse = http.del(`${BASE_URL}/store/order/${orderId}`);
        deleteOrderTrend.add(new Date() - startTime);

        check(deleteResponse, {
          'Delete Order status is 200': (r) => r.status === 200,
        }) || errorRate.add(1);
      });
    });
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "k6-report/converted-results.html": htmlReport(data),
  };
}
