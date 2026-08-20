const mongoose = require('mongoose');
const config = require('./index.js');

const connectDB = async ()=>{
    try{
        await mongoose.connect(config.mongoUri);

        console.log("MongoDB connected successfully!!");
    } catch(error){
        console.log("MongoDB connect failed: ", error.message);
        // process.exit(1);
        throw error;
    }
};

const closeDB = async()=>{
    try{
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch(error){
        console.log('Error closing MonoDB connection: ', error.message);
    }
}

mongoose.connection.on("connected", ()=>{
    console.log("MongoDB connection establised");
});
mongoose.connection.on("error", (error)=>{
    console.error("MongoBD connection error: ", error.message);
});
mongoose.connection.on("disconnected", ()=>{
    console.log("MongoDB disconnected");
});

module.exports = {
    connectDB,
    closeDB,
};