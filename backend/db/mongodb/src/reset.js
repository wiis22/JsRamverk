/**
 * Connect to the texteditor database and reset it
 */
"use strict";

const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/texteditor";

const fs = require("fs");
const path = require("path");


// reset collection documents
resetCollection(dsn, "documents")
    .catch(err => console.log(err));



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
async function resetCollection(dsn, colName) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);

    await col.deleteMany();

    await client.close();
}
