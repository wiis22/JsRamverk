const db = require("../db/mongodb/src/database.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const auth = {
    register: async function (userData) {
        try {
            const userData = await db.getOneUser(loginData.email);
            throw error("Username is alrady in use!: ", userData.email)
        } catch (err) {
            try {
                const hash = await bcrypt.hash(userData.password, 10);
                userData.password = hash;
                console.log("hash: ", hash);
                
                await db.addOne("users", userData);
                return true;
            } catch (error) {
                return error.message("Failed to add a user.");
            }
        }
    },

    login: async function(loginData) {
        try {
            const userData = await db.getOneUser(loginData.email);

            console.log("userData in auth.login:", userData)

            const res = await this.comparePasswords(loginData.password, userData.password);

            if (res) {
                const payload = { email: loginData.email };
                const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
                return jwtToken;
            }

            console.log("res in auth.login:", res)
            return res; // will be false
        } catch (error) {
            return error.message
        }
    },

    comparePasswords: async function (enteredPassword, correctPasswordHash) {
        try {
            const match = bcrypt.compare(enteredPassword, correctPasswordHash);
            return match;
        } catch (err) {
            console.error("Compare by bycrypt failed", err);
            return false;
        }
    },

    verifyToken: async function(token) {
        const res = await jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
               return false;
            }
            return true;
        });
        return res;
    },

}

module.exports = auth;
