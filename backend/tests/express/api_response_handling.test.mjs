process.env.NODE_ENV = 'test';

import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../api_response_handling.mjs';

const chai = use(chaiHttp);
const request = chai.request.execute;


describe('Express API routes tests', () => {
    const newDocData = {
        title: "new-doc-title"
    };
    let newId;

    // /get-all-docs
    describe('Get /api/get-all-docs', () => {
        it('200 HAPPY PATH', async () => {
            const res = await request(server)
                .get("/api/get-all-docs");

            expect(res).to.have.status(200);
        });

        it('should return array of documents', async () => {
            const res = await request(server)
                .get("/api/get-all-docs");

            expect(res.body).to.be.instanceOf(Array);
            expect(res.body.length).to.be.greaterThan(0);

            res.body.forEach(doc => {
                expect(doc).to.be.instanceOf(Object);
                expect(doc).to.have.property("_id");
                expect(doc).to.have.property("title");
                expect(doc).to.have.property("content");
            });
        });
    });

    // /new-doc
    describe('Post /api/new-doc', () => {
        it('200 HAPPY PATH', async () => {
            const res = await request(server)
                .post("/api/new-doc")
                .send(newDocData);

            newId = res.body;

            expect(res).to.have.status(200);
        });

        it('should return id of created document', async () => {
            const res = await request(server)
                .post("/api/new-doc")
                .send(newDocData);

            expect(res.body).to.be.a("string");
            expect(res.body.length).to.equal(24);
        });
    });

    // /doc/:id
    describe('Get /api/doc/:id', () => {
        it('200 HAPPY PATH', async () => {
            const route = "/api/doc/" + newId;
            const res = await request(server)
                .get(route);

            expect(res).to.have.status(200);
        });

        it('should return document', async () => {
            const route = "/api/doc/" + newId;
            const res = await request(server)
                .get(route);

            expect(res.body).to.be.instanceOf(Object);
            expect(res.body).to.have.property("_id");
            expect(res.body).to.have.property("title");
            expect(res.body).to.have.property("content");
        });
    });

    // /update
    describe('Post /api/update', () => {
        it('200 HAPPY PATH', async () => {
            const updateDocData = {
                id: newId,
                title: "new-title",
                content: "new-content"
            };

            const res = await request(server)
                .post("/api/update")
                .send(updateDocData);

            expect(res).to.have.status(200);
        });

        it('should return document id', async () => {
            const updateDocData = {
                id: newId,
                title: "new-title",
                content: "new-content"
            };

            const res = await request(server)
                .post("/api/update")
                .send(updateDocData);

            expect(res.body).to.have.property("acknowledged");
            expect(res.body.acknowledged).to.equal(true);
        });
    });
});
