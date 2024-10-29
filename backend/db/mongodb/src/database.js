/**
 * Functions to manipulate the texteditor database.
 */
"use strict";

require('dotenv').config();
const mongo = require("mongodb").MongoClient;
const { MongoClient, ObjectId } = require("mongodb"); 
let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ehwhv.mongodb.net/texteditor?retryWrites=true&w=majority&appName=Cluster0`;
console.log("dsn: " + dsn)
// const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/texteditor";

const fs = require("fs");
const path = require("path");
const { error, log } = require("console");
const common = require('mocha/lib/interfaces/common');


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
        console.log("data inne i addOne db:", data);
        
        const result = await col.insertOne(data);

        await client.close();

        return result.insertedId; //tock away the .tostring().
        // As it allready gets converted to sting in the index.ejs.
    },


    /**
     * Remove one into the collection
     *
     * @async
     *
     * @param {string} colName  Name of collection.
     * @param {string} id       Id to be Removed into Db.
     *
     * @throws Error when database operation fails.
     *
     * @return {object} Return info about the operation.
     */
    deleteOne: async function deleteOne(colName, id) {
        console.log('DSN:', dsn);
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);

        const data = {
            _id: new ObjectId(String(id))
        };
        const result = await col.deleteOne(data);

        await client.close();

        return result;
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
     * @param {string} username  User to get docs for
     *
     * @throws Error when database operation fails.
     *
     * @return {Object|null} The resould in JSON format, or null if no doc found.
     */
    getUserDocs: async function getUserDocs(colName, username) {
        try {
            // console.log('DSN:', dsn);
            const client  = await mongo.connect(dsn);
            const db = await client.db();
            console.log("user inne i getUserDocs:", username);
            
            const col = await db.collection(colName);
            
            const result = await col.find({ users: username }).toArray();
            // const result2 = await col.find({ users: { $in: [username] } }).toArray();
            const result3 = await col.find().toArray();

            await client.close();

            console.log("result inne i getuserDocs:", result);
            // console.log("result2 inne i getuserDocs:", result2);
            console.log("result3 inne i getuserDocs:", result3);

            return result;
        } catch (err) {
            console.log(err);
            if (err.message == "Collection does not exist") {
                throw err;
            } // Could throw general error below here
        }
    },

    /**
     * Get one document from a collection in the database based on id.
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
                throw err;
            } // Could throw general error below here
        }
    },

    /**
     * Get one user from a users collection based on email.
     *
     * @async
     *
     * @param {string} email    The email to check if in the db.
     *
     * @throws Error when database operation fails.
     *
     * @return {Object|null} The result in JSON format
     */
    getOneUser: async function getOneUser(email) {
        try {
            const client  = await mongo.connect(dsn);
            const db = await client.db();
            const col = await db.collection("users");

            const result = await col.findOne({ email: email });

            await client.close();

            // console.log('result i db getOneUser :', result);
            if (!result) {
                throw new Error("No user found with email");
            }

            return result;
        } catch (err) {
            console.log(err);
            throw new Error("Couldn't find user data based on email");
        }
    },

    /**
     * Update a documents Title or/and content by with the ID.
     *
     * @async
     *
     * @param {string} colName Name of collection.
     * @param {object} data    Data containing ID in hexadecimal format, title, content and array of users.
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

            // if (!ObjectId.isValid(String(data.id))) {
            //     throw new Error("ID format is not valid");
            // }

            console.log("data", data)
            console.log("id", data._id)
            // ObjectId: Needs to be super sure
            // that id is in a correct format else it wont work.
            // const objectId = new ObjectId(String(data.id)); // this should only be done if it's a string. in api/doc-add-user it's already an ObjectId as it becomes a string when its converted to json
            console.log("id", data._id)
            // console.log("objectId", objectId)
            // console.log('objectId', objectId);

            console.log("here 1")
            const client  = await mongo.connect(dsn);
            const db = await client.db();
            const col = await db.collection(colName);
            console.log("here 2")
            const result = await col.updateOne(
                { _id: data._id },
                { $set: { title: data.title, content: data.content, users: data.users } }
            );
            console.log("here 3")
            await client.close();

            // console.log('result:', result);
            console.log("here 4")
            return result;


        } catch (err) {
            console.error("Error in updateOneDoc:", err.message);
            throw new Error("Error updating a document");
        }
    },

    /**
     * Insert one into the collection
     *
     * @async
     *
     * @param {string} docId The unique id of the doc to retrive comments for.
     *
     * @throws Error when database operation fails.
     *
     * @return {Array<object>} Returns and array of comments associatet with the doc.
     */
    getComments: async function getComments(docId) {
        try {
            const client  = await mongo.connect(dsn);
            const db = await client.db();
            const col = await db.collection("comments");

            const result = await col.find({ docId }).toArray();

            await client.close();

            return result;
        } catch (err) {
            console.error("error in getComments:", err.stack);
            throw new Error("Failed to retrive commetns from the DB.");
        }

    },
};

module.exports = dbFunctions;
