import 'dotenv/config'

const port = process.env.PORT;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import dbFunctions from "./db/mongodb/src/db_functions.js";

const app = express();

app.disable('x-powered-by');
app.use(cors());

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/update", async (req, res) => {
    const data = {
        id: req.body.id,
        title: req.body.title,
        content: req.body.content
    };

    const id = await dbFunctions.updateOneDoc("documents",data);

    const result = await dbFunctions.getOne("documents", id);

    res.json(result); // need to check here if this works and what the format of the id is
});

app.post("/api/new-doc", async (req, res) => {
    const data = {
        title: req.body.title,
        content: "" 
    };
    
    const result = await dbFunctions.addOne("documents", data);

    if (!result) {
        return res.status(404).json({ error: 'No returned id when trying to add new document' });
    }

    return res.redirect(`/${result}`); // we can't use any express redirects to keep it SPA
});

app.get('/api/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (id.length !== 24){
            return res.status(400).send('Invalid ID format');
        }

        const result = await dbFunctions.getOne("documents", id);

        if (!result) {
            return res.status(404).send('Document not found');
        }

        return res.json(result);
    } catch(error) {
        console.error('Error fething document:', error);
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/api/get-all-docs', async (req, res) => {
    try {
        const result = await dbFunctions.getAll("documents");
    } catch(error) {
        console.error('Error fetching documents:', error);
        return res.status(500).send('Internal server Error');
    }

    res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});