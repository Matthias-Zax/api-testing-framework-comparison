import request from 'supertest';

const baseUrl = 'https://petstore.swagger.io/v2';
let orderId: number;

describe('Petstore Store API Tests', () => {
  const api = request(baseUrl);

  it('should create a new order', async () => {
    const newOrder = {
      id: 1,
      petId: 12345,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false
    };

    const response = await api
      .post('/store/order')
      .send(newOrder)
      .expect(200);

    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe(newOrder.status);
    expect(response.body.petId).toBe(newOrder.petId);
    orderId = response.body.id;
  });

  it('should get order by ID', async () => {
    expect(orderId).toBeDefined();
    
    const response = await api
      .get(`/store/order/${orderId}`)
      .expect(200);

    expect(response.body.id).toBe(orderId);
    expect(response.body.status).toBe('placed');
  });

  it('should get store inventory', async () => {
    const response = await api
      .get('/store/inventory')
      .expect(200);

    expect(response.body).toBeTruthy();
    // Verify that inventory contains status counts
    expect(Object.keys(response.body).length).toBeGreaterThan(0);
  });

  it('should delete an order', async () => {
    // Delete the order
    await api
      .delete(`/store/order/${orderId}`)
      .expect(200);

    // Verify the order is deleted by trying to fetch it
    await api
      .get(`/store/order/${orderId}`)
      .expect(404);
  });
});
