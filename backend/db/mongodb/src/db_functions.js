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
            const col = await db.collection(colName);

            // sould make it so only id and title get put therw

            const result = await col.find().toArray();

            await client.close();

            // console.log(result);

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
     * @return {Object|null} The result in JSON format
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

            console.log('DSN:', dsn);
            console.log('ID:', data.id);
            console.log('Title:', data.title);
            console.log('Content:', data.content);

            if (!ObjectId.isValid(String(data.id))) {
                throw new Error("ID format is not valid");
            }
            // ObjectId: Needs to be super sure
            // that id is in a correct format else it wont work.
            const objectId = new ObjectId(String(data.id));
            console.log('objectId', objectId);

            const client  = await mongo.connect(dsn);
            const db = await client.db();
            const col = await db.collection(colName);

            const result = await col.updateOne(
                { _id: objectId },
                { $set: { title: data.title, content: data.content } }
            );

            await client.close();

            console.log('result:', result);

            return result;


        } catch (err) {
            console.error("Error in updateOneDoc:", err.message);
            throw new Error("Error updating a document");
        }
    }
};

module.exports = dbFunctions;
