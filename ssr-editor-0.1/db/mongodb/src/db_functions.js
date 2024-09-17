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
     * Insert one into the collection
     *
     * @async
     *
     * @param {string} colName Name of collection.
     * @param {string} data    Data to be inserted into Db.
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
    },

    /**
     * Insert one into the collection
     *
     * @async
     *
     * @param {string} colName Name of collection.
     * @param {string} data    Data to be inserted into Db.
     *
     * @throws Error when database operation fails.
     *
     * @return {} The resould in JSON format
     */
        getAll: async function getAll(colName) {
            try {
                console.log('DSN:', dsn);
                const client  = await mongo.connect(dsn);
                const db = await client.db();
                const col = await db.collection(colName);
        
                const result = await col.find().toArray();
        
                await client.close();

                console.log(result);

                return result;
            } catch (err) {
                console.log(err);
            }
        }
};

module.exports = dbFunctions;
