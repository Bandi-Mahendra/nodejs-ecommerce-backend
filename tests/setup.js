const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-key";
  process.env.JWT_EXPIRES_IN = "1h";
  process.env.NODE_ENV = "test";

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});
