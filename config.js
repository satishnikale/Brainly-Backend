"use strict";
const MONGO_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;
const JWT_SECREAT = process.env.JWT_SECREAT;
module.exports = {
    MONGO_URL,
    PORT,
    JWT_SECREAT
};
