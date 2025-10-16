import { MongoClient, MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("❌ Missing MONGODB_URI environment variable");
}

const options: MongoClientOptions = {
  appName: "obscura.vercel.mongodb",
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
  attachDatabasePool(client);
}

export default client;
