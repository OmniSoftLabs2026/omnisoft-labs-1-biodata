import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URL
if (!uri) throw new Error('Missing MONGO_URL')

const options = {}

let cached = global._mongoClientPromise
if (!cached) {
  const client = new MongoClient(uri, options)
  cached = global._mongoClientPromise = client.connect()
}

export default cached
