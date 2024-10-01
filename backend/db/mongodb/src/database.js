/**
 * Functions to manipulate the texteditor database.
 */
"use strict";

const mongo = require("mongodb").MongoClient;
const { MongoClient, ObjectId } = require("mongodb"); 

const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/texteditor";

const fs = require("fs");
const path = require("path");
const { error, log } = require("console");


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
     * @return {string} Return the id.
     */
    addOne: async function addOne(colName, data) {
        console.log('DSN:', dsn);
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);

        const result = await col.insertOne(data);

        await client.close();

        return result.insertedId; //tock away the .tostring().
        // As it allready gets converted to sting in the index.ejs.
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
     * @return {Object|null} The resould in JSON format, or null if no doc found.
     */
    getAll: async function getAll(colName) {
        try {
            // console.log('DSN:', dsn);
            const client  = await mongo.connect(dsn);
            const db = await client.db();

            // check if the collection exist
            const collections = await db.listCollections().toArray();
            const collectionNames = collections.map(col => col.name);

            if (!collectionNames.includes(colName)) {
                throw new Error("Collection does not exist");
            }

            const col = await db.collection(colName);
            const result = await col.find().toArray();

            await client.close();

            // console.log(result);

            return result;
        } catch (err) {
            console.log(err);
            if (err.message == "Collection does not exist") {
                throw err;
            } // Could throw general error below here
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
     * @return {Object|null} The result in JSON format
     */
    getOne: async function getOne(colName, id) {
        try {
            // console.log('DSN:', dsn);
            // console.log('ID:', id)

            // throw error if id is not any of the following formats:
            // string of length 24, integer or ObjectId
            if (!((typeof id == 'string' && id.length == 24)
                || Number.isInteger(id) || id instanceof ObjectId)) {
                throw new Error("Error: id has invalid format");
            }

            const objectId = new ObjectId(id);
            // console.log('objectId', objectId);

            const client  = await mongo.connect(dsn);
            const db = await client.db();
            const col = await db.collection(colName);

            const result = await col.findOne({ _id: objectId });

            await client.close();

            // console.log('result:', result);

            return result;
        } catch (err) {
            console.log(err);
            if (err.message == "Error: id has invalid format") {
                console.log("here")
                throw err;
            } // Could throw general error below here
        }
    },

    /**
     * Update a documents Title or/and content by with the ID.
     *
     * @async
     *
     * @param {string} colName Name of collection.
     * @param {object} data    Data containing ID in hexadecimal format, title and content.
     *
     * @throws Error when database operation fails.
     *
     * @return {Object|null} The resould in JSON format
     */
    updateOneDoc: async function updateOneDoc(colName, data) {
        try {

            // console.log('DSN:', dsn);
            // console.log('ID:', data.id);
            // console.log('Title:', data.title);
            // console.log('Content:', data.content);

            if (!ObjectId.isValid(String(data.id))) {
                throw new Error("ID format is not valid");
            }
            // ObjectId: Needs to be super sure
            // that id is in a correct format else it wont work.
            const objectId = new ObjectId(String(data.id));
            // console.log('objectId', objectId);

            const client  = await mongo.connect(dsn);
            const db = await client.db();
            const col = await db.collection(colName);

            const result = await col.updateOne(
                { _id: objectId },
                { $set: { title: data.title, content: data.content } }
            );

            await client.close();

            // console.log('result:', result);

            return result;


        } catch (err) {
            console.error("Error in updateOneDoc:", err.message);
            throw new Error("Error updating a document");
        }
    }
};

module.exports = dbFunctions;