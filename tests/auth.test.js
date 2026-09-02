const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Authentication API", () => {
  test("registers a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    expect(response.headers["set-cookie"]?.[0]).toContain("token=");
    expect(response.body.data.user.email).toBe("jane@example.com");
  });

  test("logs in an existing user", async () => {
    await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "john@example.com",
        password: "password123",
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    expect(response.headers["set-cookie"]?.[0]).toContain("token=");
  });

  test("returns the authenticated user's profile with bearer token", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Profile User",
        email: "profile@example.com",
        password: "password123",
      });

    const response = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${registerResponse.body.data.token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe("profile@example.com");
    expect(response.body.data.user.password).toBeUndefined();
  });

  test("returns the authenticated user's profile with saved cookie token", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Cookie User",
        email: "cookie-profile@example.com",
        password: "password123",
      });

    const response = await request(app)
      .get("/api/auth/profile")
      .set("Cookie", registerResponse.headers["set-cookie"])
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe("cookie-profile@example.com");
  });

  test("updates the authenticated user's profile", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Old Name",
        email: "update-profile@example.com",
        password: "password123",
      });

    const response = await request(app)
      .put("/api/auth/profile")
      .set("Authorization", `Bearer ${registerResponse.body.data.token}`)
      .send({
        name: "New Name",
        phone: "9876543210",
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.name).toBe("New Name");
    expect(response.body.data.user.email).toBe("update-profile@example.com");
  });
});
