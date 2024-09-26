import * as chai from 'chai';
const { expect } = chai;

// import chaiHttp from 'chai-http';
import server from '../../api_response_handling.mjs'; // behövs inte i denna fil. den behövs för tester av express routes.
import dbFunctions from '../../db/mongodb/src/db_functions.js';
import { ObjectId } from 'mongodb';

describe('Database functions tests', () => {
    const testDataValid = {
        title: "test-title-1",
        content: "test content. test content .*/-, test content"
    };

    const testDataInvalid = {
        title: "test-title-2",
        content: "test content. test content .*/-, test content",
        _id: "invalid format"
    };

    describe('addOne', () => {
        it('should return id of created document', async () => {
            const result = await dbFunctions.addOne("documents", testDataValid);
            expect(result).to.be.instanceOf(ObjectId);
        });

        it('should handle error case correctly', async () => {
            try {
                await dbFunctions.addOne("documents", testDataInvalid);
            } catch (error) {
                expect(error).to.exist;
            }
        });
    });

    describe('getOne', () => {
        it('should return a document', async () => {
            const id = await dbFunctions.addOne("documents", testDataValid);
            const result = await dbFunctions.getOne("documents", id);
            expect(result).to.be.instanceOf(Object);
            expect(result).to.be.keys(['_id', 'title', 'content'])
        });

        it('should handle error case correctly', async () => {
            try {
                const result = await dbFunctions.getOne("documents", 'invalid-id-format');
            } catch (error) {
                expect(error).to.exist;
            }
        });
    });
});
