const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

const getToken = async (role = "admin") => {
  const user = await User.create({
    name: `${role} User`,
    email: `${role}@example.com`,
    password: "password123",
    role,
  });

  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: user.email, password: "password123" });

  return response.body.data.token;
};

describe("Product API", () => {
  test("creates a product as admin", async () => {
    const token = await getToken("admin");

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Wireless Mouse",
        description: "Comfortable wireless mouse for daily productivity.",
        price: 29.99,
        category: "Accessories",
        brand: "Arena",
        stock: 25,
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.product.name).toBe("Wireless Mouse");
  });

  test("lists products with pagination", async () => {
    const token = await getToken("admin");

    await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Mechanical Keyboard",
        description: "Tactile keyboard with durable switches and clean layout.",
        price: 79.99,
        category: "Accessories",
        stock: 10,
      });

    const response = await request(app)
      .get("/api/products?page=1&limit=5&category=Accessories")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.products).toHaveLength(1);
    expect(response.body.meta.total).toBe(1);
  });

  test("blocks product creation for normal users", async () => {
    const token = await getToken("user");

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Desk Lamp",
        description: "Minimal desk lamp with adjustable brightness.",
        price: 19.99,
        category: "Home",
        stock: 8,
      })
      .expect(403);

    expect(response.body.success).toBe(false);
  });
});
