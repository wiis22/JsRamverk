import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import dbFunctions from "./db/mongodb/src/database.js";
import auth from "./auth/auth.js";

import formData from "form-data";
import Mailgun from "mailgun.js";
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

// import jwt from 'jsonwebtoken';
// import { equal } from 'assert';

const app = express();
const port = process.env.PORT || 1337;

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

app.get("/api/verify-logged-in", async (req, res) => {
    const data = {
        loggedIn: false
    };

    const jwtToken = req.headers['x-access-token'];
    console.log("jwtToken i verify-api!: ", jwtToken);

    const result = await auth.verifyToken(jwtToken);
    console.log("result i api verify: ", result);
    
    if (result) {
        data.loggedIn = result; // true
    }

    res.json(data);
});

app.post("/api/login", async (req, res) => {
    const loginData = {
        email: req.body.email,
        password: req.body.password
    };

    // console.log("loginData:", loginData);

    const result = await auth.login(loginData);

    console.log("result in /api/login:", result);

    res.json(result);
});

app.post("/api/register", async (req, res) => {
    const newUserData = {
        email: req.body.email,
        password: req.body.password
    };

    try {
        const result = await auth.register(newUserData);
        // if (!result) {
        //     throw new Error(result.message || "Registation failed");
        // }

        console.log("result in api/register", result)
        res.json({ success: true, data: result });

    } catch (err) {
        // console.log("error thrown inne i api/register: ", err.message);
        res.json({ success: false, error: err.message });
    }
});

app.post("/api/update", async (req, res) => {
    const data = {
        id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        users: req.body.users
    };

    // console.log("data in api:", data);


    const result = await dbFunctions.updateOneDoc("documents", data);

    // const result = await dbFunctions.getOne("documents", id);

    res.json(result); // result is info saying it went well or not
});

app.post("/api/new-doc", async (req, res) => {
    const data = {
        title: req.body.title,
        content: "",
        users: [req.body.user]
    };
    console.log("data inne i api/new-doc:", data);
    
    const result = await dbFunctions.addOne("documents", data); //back from addOne will be the id

    if (!result) {
        return res.status(404).json({ error: 'No returned id when trying to add new document' });
    }

    res.json(result);
});

app.get('/api/doc/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (id.length !== 24){
            return res.status(400).send('Invalid ID format');
        }

        const result = await dbFunctions.getOne("documents", id);
        // console.log(result);

        // if (!result) {
        //     return res.status(404).send('Document not found');
        // }

        res.json(result);
    } catch(error) {
        console.error('Error fething document:', error);
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/api/get-all-docs', async (req, res) => {
    try {
        const result = await dbFunctions.getAll("documents");
        // console.log("res: ", result);
        res.json(result);
    } catch(error) {
        console.error('Error fetching documents:', error);
        return res.status(500).send('Internal server Error');
    }
});

app.post('/api/get-user-docs', async (req, res) => {
    try {
        console.log("body: ", req.body.user);
        const username = req.body.user;
        const result = await dbFunctions.getUserDocs("documents" ,username);
        res.json(result);
    } catch(error) {
        console.error('Error fetching documents:', error);
        return res.status(500).send('Internal server Error');
    }
});

app.post('/api/share-doc', async (req, res) => {

    const registerUrl = `http://localhost:3000/register?email=${req.body.email}+id=${req.body.id}`;

    console.log("sending email with link: ", registerUrl);

    const result = mg.messages.create('sandbox-123.mailgun.org', {
        from: `JSR Texteditor <${process.env.MAILGUN_API_KEY}>`,
        to: [req.body.email],
        subject: "Share document",
        text: "Testing some Mailgun awesomeness!",
        html: `<h1>Click the link below to get access to the document ${req.body.title}</h1>
                <a href=${registerUrl}>Accept access</a>`
    })

    console.log("mailgun res: ", result);
    
    res.json(result);
});


const server = app.listen(port, () => console.log(`Example app listening on port ${port}`));
// export of server is for testing test
export default server;
