import { test, expect } from '@playwright/test';

test.describe.serial('Petstore Store API Tests', () => {
  const baseUrl = 'https://petstore.swagger.io/v2';
  let orderId: number;

  test('should create a new order', async ({ request }) => {
    const newOrder = {
      id: 1,
      petId: 12345,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false
    };

    const response = await request.post(`${baseUrl}/store/order`, {
      data: newOrder
    });
    expect(response.ok()).toBeTruthy();
    const createdOrder = await response.json();
    expect(createdOrder.id).toBeDefined();
    expect(createdOrder.status).toBe(newOrder.status);
    expect(createdOrder.petId).toBe(newOrder.petId);
    orderId = createdOrder.id;
  });

  test('should get order by ID', async ({ request }) => {
    expect(orderId).toBeDefined();
    const response = await request.get(`${baseUrl}/store/order/${orderId}`);
    expect(response.ok()).toBeTruthy();
    const order = await response.json();
    expect(order.id).toBe(orderId);
    expect(order.status).toBe('placed');
  });

  test('should get store inventory', async ({ request }) => {
    const response = await request.get(`${baseUrl}/store/inventory`);
    expect(response.ok()).toBeTruthy();
    const inventory = await response.json();
    expect(inventory).toBeTruthy();
    // Verify that inventory contains status counts
    expect(Object.keys(inventory).length).toBeGreaterThan(0);
  });

  test('should delete an order', async ({ request }) => {
    const response = await request.delete(`${baseUrl}/store/order/${orderId}`);
    expect(response.ok()).toBeTruthy();

    // Verify the order is deleted by trying to fetch it
    const getResponse = await request.get(`${baseUrl}/store/order/${orderId}`);
    expect(getResponse.ok()).toBeFalsy();
    expect(getResponse.status()).toBe(404);
  });
});
