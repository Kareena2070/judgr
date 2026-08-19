require('dotenv').config();

const PORT = process.env.PORT;

if(!PORT){
    throw new Error("PORT environment variable is required");
}

module.exports = {
    PORT,
    NODE_ENV: process.env.NODE_ENV || "development",
};
