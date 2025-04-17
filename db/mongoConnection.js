import {ServerApiVersion, MongoClient}  from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export default client;


