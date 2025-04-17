import client from "./mongoConnection.js";
import dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DB_NAME;

export async function getUserThread(userId) {
    /**
     * Recupera el hilo del usuario desde la base de datos MongoDB.
     * @param {string} userId - Identificador del usuario.
     * @returns {Promise<string|null>} - threadId si existe, si no, null.
     */
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(process.env.COLLECTION_NAME);

        const result = await collection.findOne({ userId });
        return result ? result.threadId : null;
    } finally {
        await client.close();
    }
}

export async function setUserThread(userId, threadId) {
    /**
     * Guarda o actualiza el hilo del usuario en la base de datos MongoDB.
     * @param {string} userId - Identificador del usuario.
     * @param {string} threadId - Identificador del hilo.
     * @returns {Promise<object>} - Resultado de la operación.
     */
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(process.env.COLLECTION_NAME);

        const result = await collection.updateOne(
            { userId },
            { $set: { threadId } },
            { upsert: true }
        );
        return result;
    } finally {
        await client.close();
    }
}
