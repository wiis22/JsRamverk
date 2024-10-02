import * as chai from 'chai';
const { expect } = chai;
import dbFunctions from '../../db/mongodb/src/database.js';
import { ObjectId } from 'mongodb';


describe('Database functions tests', () => {
    const testDataValid = {
        title: "test-title-1",
        content: "test content. .*/-,"
    };

    const testDataInvalid = {
        title: "test-title-2",
        content: "test content. .*/-,",
        _id: "invalid format"
    };

    let id;

    describe('addOne', () => {
        it('should return id of created document', async () => {
            const result = await dbFunctions.addOne("documents", testDataValid);
            id = result;
            expect(result).to.be.instanceOf(ObjectId);
        });

        // it('should handle error case correctly', async () => {
        //     try {
        //         await dbFunctions.addOne("documents", testDataInvalid);
        //     } catch (error) {
        //         expect(error).to.exist;
        //     }

        // });
    });

    describe('getOne', () => {
        it('should return a document', async () => {
            const result = await dbFunctions.getOne("documents", id);
            expect(result).to.be.instanceOf(Object);
            expect(result).to.be.keys(["_id", "title", "content"])
        });

        it('should throw an error if format of id is invalid', async () => {
            try {
                const result = await dbFunctions.getOne("documents", "invalid-id-format");
            } catch (error) {
                expect(error).to.exist;
                expect(error.message).to.equal("Error: id has invalid format");
            }
        });
    });

    describe('getAll', () => {
        it('should return array of all documents', async () => {
            const result = await dbFunctions.getAll("documents");
            expect(result).to.be.instanceOf(Array);
            expect(result.length).to.be.greaterThan(0);
            result.forEach(doc => {
                expect(doc).to.have.property("_id");
                expect(doc).to.have.property("title");
                expect(doc).to.have.property("content");
            })
        });

        it("should throw an error if collection doesn't exist", async () => {
            try {
                const result = await dbFunctions.getAll("non-existing-collection");
                console.log("Expected failure but got result: " + result);
            } catch (error) {
                expect(error).to.exist;
                expect(error.message).to.equal("Collection does not exist");
            }
        });

        // it('should throw error for general error case', async () => {
        //     // vet inte hur jag ska framtvinga error längst ner i getAll().
        //     try {
        //         const result = await dbFunctions.getAll("non-existing-collection");
        //         console.log("Expected failure but got result: " + result);
        //     } catch (error) {
        //         expect(error).to.exist;
        //         expect(error.message).to.equal("Error retriving the documents");
        //     }
        // });
    });

    describe('updteOneDoc', () => {
        it('should return an object with acknowledged, matchedCount, and modifiedCount', async () => {
            const data = {
                id: id,
                title: "New Title",
                content: "New Content"
            };

            const result = await dbFunctions.updateOneDoc("documents", data);

            expect(result).to.have.property('acknowledged').that.is.true;
            expect(result).to.have.property('matchedCount').that.equals(1);
            expect(result).to.have.property('modifiedCount').that.equals(1);
        });

        it('should throw an error if the format of id is invalid', async () => {
            try {
                const result = await dbFunctions.updateOneDoc("documents", testDataInvalid);
                console.log("Expected failure but got result: " + result);
            } catch (error) {
                expect(error).to.exist;
                expect(error.message).to.equal("Error updating a document");
            }
        });
    });

    describe('deleteOneDoc', () => {
        it('should return an object with acknowledged, deletedCount', async () => {

            const result = await dbFunctions.deleteOne("documents", id);

            expect(result).to.have.property('acknowledged').that.is.true;
            expect(result).to.have.property('deletedCount').that.equals(1);
        });
    });
});
