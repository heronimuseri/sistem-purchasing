import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("Health Check", () => {
    it("should return 200 OK", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("ok");
    });
});

describe("API Endpoints Structure", () => {
    it("should return 401 for protected routes without auth", async () => {
        const response = await request(app).get("/api/users");
        expect(response.status).toBe(401);
    });

    it("should return 401 for suppliers without auth", async () => {
        const response = await request(app).get("/api/suppliers");
        expect(response.status).toBe(401);
    });

    it("should return 401 for purchase-requests without auth", async () => {
        const response = await request(app).get("/api/purchase-requests");
        expect(response.status).toBe(401);
    });

    it("should return 401 for purchase-orders without auth", async () => {
        const response = await request(app).get("/api/purchase-orders");
        expect(response.status).toBe(401);
    });

    it("should return 401 for goods-receipts without auth", async () => {
        const response = await request(app).get("/api/goods-receipts");
        expect(response.status).toBe(401);
    });

    it("should return 401 for payments without auth", async () => {
        const response = await request(app).get("/api/payments/pending");
        expect(response.status).toBe(401);
    });

    it("should return 401 for reports without auth", async () => {
        const response = await request(app).get("/api/reports/purchasing");
        expect(response.status).toBe(401);
    });
});
