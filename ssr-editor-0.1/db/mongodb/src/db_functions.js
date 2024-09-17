/**
 * Functions to manipulate the texteditor database.
 */
"use strict";

const mongo = require("mongodb").MongoClient;
const { MongoClient, ObjectId } = require("mongodb"); 

const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/texteditor";

const fs = require("fs");
const path = require("path");
const { error } = require("console");


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
     * @return {string} Return the id in a string.
     */
    addOne: async function addOne(colName, data) {
        console.log('DSN:', dsn);
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);

        const result = await col.insertOne(data);

        await client.close();

        return result.insertedId;
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
            throw new Error("Error retriving the documents");
        }
    },

    /**
     * Insert one into the collection
     *
     * @async
     *
     * @param {string} colName Name of collection.
     * @param {string} id    The id hexadecimal format to find in the db.
     *
     * @throws Error when database operation fails.
     *
     * @return {} The resould in JSON format
     */
    getOne: async function getOne(colName, id) {
        try {
            console.log('DSN:', dsn);
            console.log('ID:', id)

            if (typeof id !== 'string' && id >= 24) {
                throw new error("ID most be a string in hexadecimal form");
            }

            const objectId = new ObjectId(id);
            console.log('objectId', objectId);


            const client  = await mongo.connect(dsn);
            const db = await client.db();
            const col = await db.collection(colName);



            const result = await col.findOne({ _id: objectId });
    
            await client.close();

            console.log('result:', result);

            return result;
        } catch (err) {
            console.log(err);
            throw new Error("Error retriving the document");
        }
    }
};

module.exports = dbFunctions;
