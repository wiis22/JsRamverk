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

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.post("/update", async (req, res) => {
//     const result = await documents.updateOne(req.body);
// 
//     return res.redirect(`/${req.body.lastID}`);
// });

app.post("/newdoc", async (req, res) => {
    const data = {
        title: req.body.title,
        content: "" 
    };
    
    const result = await dbFunctions.addOne("documents", data);

    return res.redirect(`/${result}`);
});

// app.get('/:id', async (req, res) => {
//     return res.render(
//         "doc",
//         { doc: await documents.getOne(req.params.id) }
//     );
// });

app.get('/', async (req, res) => {

    const result = await dbFunctions.getAll("documents");
    return res.render("index", { docs: result });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
