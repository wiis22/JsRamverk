const db = require("../db/mongodb/src/database.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const auth = {
    register: async function (userData) {
        // hash password here before using db.addOne()

        const res = await db.addOne("users", userData);

        return res;
    },

    login: async function(loginData) {
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
    },

    logout: function () {
        
    },

    comparePasswords: async function (enteredPassword, correctPasswordHash) {
        console.log("arguments in comparePassword:")
        console.log("enteredPassword", enteredPassword)
        console.log("correctPasswordHash", correctPasswordHash)
        const res = bcrypt.compare(enteredPassword, correctPasswordHash, (err, result) => {
            if (err) {
                return false
            }
            return true;
        });

        return res;
    },

    verifyToken: function() {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
               return false
            }
        });
    },

}

module.exports = auth;
