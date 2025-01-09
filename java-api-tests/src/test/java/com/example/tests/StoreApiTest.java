package com.example.tests;

import com.example.config.TestConfig;
import com.example.model.Order;
import io.restassured.response.Response;
import org.testng.annotations.Test;

import java.time.Instant;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

public class StoreApiTest extends TestConfig {
    private Integer orderId;

    @Test(priority = 1)
    public void shouldCreateNewOrder() {
        Order newOrder = Order.builder()
                .id(1)
                .petId(12345)
                .quantity(1)
                .shipDate(Instant.now().toString())
                .status("placed")
                .complete(false)
                .build();

        Response response = given()
                .body(newOrder)
                .when()
                .post("/store/order")
                .then()
                .statusCode(200)
                .body("status", equalTo("placed"))
                .body("petId", equalTo(12345))
                .extract()
                .response();

        orderId = response.path("id");
    }

    @Test(priority = 2, dependsOnMethods = "shouldCreateNewOrder")
    public void shouldGetOrderById() {
        given()
                .pathParam("orderId", orderId)
                .when()
                .get("/store/order/{orderId}")
                .then()
                .statusCode(200)
                .body("id", equalTo(orderId))
                .body("status", equalTo("placed"));
    }

    @Test(priority = 3)
    public void shouldGetStoreInventory() {
        given()
                .when()
                .get("/store/inventory")
                .then()
                .statusCode(200)
                .body("$", hasKey(any(String.class)))  // Verify that inventory contains at least one status
                .body("$", aMapWithSize(greaterThan(0))); // Verify that inventory is not empty
    }

    @Test(priority = 4, dependsOnMethods = "shouldCreateNewOrder")
    public void shouldDeleteOrder() {
        // Delete the order
        given()
                .pathParam("orderId", orderId)
                .when()
                .delete("/store/order/{orderId}")
                .then()
                .statusCode(200);

        // Verify the order is deleted
        given()
                .pathParam("orderId", orderId)
                .when()
                .get("/store/order/{orderId}")
                .then()
                .statusCode(404);
    }
}
