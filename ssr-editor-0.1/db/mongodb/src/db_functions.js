/**
 * Functions to manipulate the texteditor database.
 */
"use strict";

const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/texteditor";

const fs = require("fs");
const path = require("path");


const dbFunctions = {
    /**
     * Reset a collection by removing existing content and insert a default
     * set of documents.
     *
     * @async
     *
     * @param {string} dsn     DSN to connect to database.
     * @param {string} colName Name of collection.
     * @param {string} doc     Documents to be inserted into collection.
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<void>} Void
     */
    addOne: async function addOne(colName, data) {
        console.log('DSN:', dsn);
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);

        const result = await col.insertOne(data);

        await client.close();

        return result.insertedId.toString();
    }
};

module.exports = dbFunctions;
