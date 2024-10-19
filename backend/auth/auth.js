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

        bcrypt.compare(loginData.password, userData.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }
        });

        if (err) {
            return false;
        }

        const payload = { email: loginData.email };
        const jwtSecret = process.env.JWT_SECRET;
        const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

        return jwtToken;
    },

    logout: function () {

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

