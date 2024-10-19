const db = require("../db/mongodb/src/database.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const auth = {
    register: function (userData) {
        db.addOne(userData);
    },

    login: function(loginData) {
        const userData = db.getOneUser(loginData.email);

        const res = this.comparePasswords(loginData.password, userData.password);

        if (res) {     
            const payload = { email: loginData.email };
            const jwtSecret = process.env.JWT_SECRET;
            const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

            return jwtToken;
        }

        return res; // will be false
    },

    logout: function () {
        
    },

    comparePasswords: function (enteredPassword, correctPasswordHash) {
        bcrypt.compare(enteredPassword, correctPasswordHash, (err, result) => {
            if (err) {
                return false
            }
            return true;
        });
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
