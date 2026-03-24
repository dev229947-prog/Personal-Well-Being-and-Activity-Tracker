const { MongoClient } = require('mongodb');

// In production, use environment variables for credentials!
const username = encodeURIComponent('dev229947_db_user');
const password = encodeURIComponent('1KWDiTwo4wHklS3V');
const uri = `mongodb+srv://${username}:${password}@cluster0.zf5vzlv.mongodb.net/?appName=Cluster0`;

let client;
let db;

async function connectDB(dbName = 'test') {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

module.exports = { connectDB };
