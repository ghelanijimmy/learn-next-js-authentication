import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.ht18qzy.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;
  return await MongoClient.connect(connectionString);
}
