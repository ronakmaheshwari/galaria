import { createClient } from "redis";

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

async function startServer() {
    try {
        await client.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startServer();

export default client