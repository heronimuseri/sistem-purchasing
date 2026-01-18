import { beforeAll, afterAll, afterEach } from "vitest";

// Test database setup
beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL =
        process.env.TEST_DATABASE_URL ||
        "postgresql://postgres:password@localhost:5432/sistem_purchasing_test";
    process.env.BETTER_AUTH_SECRET = "test-secret-key";
    process.env.BETTER_AUTH_URL = "http://localhost:3001";
    process.env.FRONTEND_URL = "http://localhost:5173";

    console.log("🧪 Test environment initialized");
});

afterAll(async () => {
    console.log("🧹 Test cleanup complete");
});

afterEach(async () => {
    // Clean up after each test if needed
});
