import { test, expect } from '@playwright/test';

test.describe.serial('Petstore API Tests', () => {
  const baseUrl = 'https://petstore.swagger.io/v2';
  let createdPetId: number;

  test('should create a new pet', async ({ request }) => {
    const newPet = {
      id: 12345,
      name: "TestPet",
      category: {
        id: 1,
        name: "Dogs"
      },
      status: "available",
      photoUrls: ["http://example.com/photo.jpg"],
      tags: [
        {
          id: 0,
          name: "test-tag"
        }
      ]
    };

    const response = await request.post(`${baseUrl}/pet`, {
      data: newPet
    });
    expect(response.ok()).toBeTruthy();
    const createdPet = await response.json();
    expect(createdPet.name).toBe(newPet.name);
    expect(createdPet.status).toBe(newPet.status);
    createdPetId = createdPet.id;
  });

  test('should get pet by ID', async ({ request }) => {
    expect(createdPetId).toBeDefined();
    const response = await request.get(`${baseUrl}/pet/${createdPetId}`);
    expect(response.ok()).toBeTruthy();
    const pet = await response.json();
    expect(pet.id).toBe(createdPetId);
  });

  test('should get store inventory', async ({ request }) => {
    const response = await request.get(`${baseUrl}/store/inventory`);
    expect(response.ok()).toBeTruthy();
    const inventory = await response.json();
    expect(inventory).toBeTruthy();
  });

  test('should create a new user', async ({ request }) => {
    const newUser = {
      id: 12345,
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123",
      phone: "1234567890",
      userStatus: 1
    };

    const response = await request.post(`${baseUrl}/user`, {
      data: newUser
    });
    expect(response.ok()).toBeTruthy();
  });
});
