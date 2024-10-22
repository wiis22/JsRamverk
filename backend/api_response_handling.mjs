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
console.log("setting up mailgun with values:")
console.log({username: 'api', key: process.env.MAILGUN_API_KEY})

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
    try {
        const data = {
            email: req.body.email,
            id: req.body.id,
            mailgunDomain: process.env.MAILGUN_DOMAIN
        };

        const registerUrl = `http://localhost:3000/register?email=${data.email}&id=${data.id}`;

        console.log("sending email with link: ", registerUrl);
        console.log("MAILGUN_DOMAIN:", data.mailgunDomain);
        console.log("MAILGUN_API_KEY:", process.env.MAILGUN_API_KEY);
        console.log("From Address:", `Excited User <mailgun@${data.mailgunDomain}>`);

        
        const result = await mg.messages.create(data.mailgunDomain, {
            from: `mailgun@${data.mailgunDomain}`,
            to: [data.email],
            subject: "Share document",
            text: "Testing some Mailgun awesomeness!",
            html: `<h1>Click the link below to register a new account and get access to the document ${req.body.title}</h1>
                    <a href="${registerUrl}">Get access</a>`
        });

        console.log("mailgun result: ", result);
        
        res.json(result); // don'know yet what this will be
    } catch (err) {
        console.error("Error sending email via mailgun: ", err);
        console.log("MAILGUN_API_KEY:", process.env.MAILGUN_API_KEY);
        res.status(500).json({ error: "Failed to send email via mailgun" });
    }
});

app.post('/api/doc-add-user', async (req, res) => {
    const data = {
        email: req.body.email,
        id: req.body.id
    }
    // get document to add new user to
    const doc = await dbFunctions.getOne("documents", data.id);
    // add new user to the document
    doc.users.append(data.email);
    // update the document in the database
    const result = await dbFunctions.updateOneDoc("documents", doc);

    res.json(result); // not sure what this will be, haven't checked
})


const server = app.listen(port, () => console.log(`Example app listening on port ${port}`));
// export of server is for testing test
export default server;
