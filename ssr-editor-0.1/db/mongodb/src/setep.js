/**
 * Connect to the texieditor database and create colletions.
 */
"use strict";

const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/texteditor";

const fs = require("fs");
const path = require("path");


// behövs nog inte
