const { MongoClient } = require('mongodb');
require('dotenv').config();

const username = encodeURIComponent(process.env.MONGODB_USER);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const cluster = process.env.MONGODB_CLUSTER;
const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=Cluster0&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000`;

let client;
let db;

async function connectDB(dbName = 'test') {
  if (db) return db;
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000
  });
  await client.connect();
  db = client.db(dbName);
  return db;
}

module.exports = { connectDB };
