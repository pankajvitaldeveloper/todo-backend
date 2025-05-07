const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();//load environment variables from .env file

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = {
    PORT: process.env.PORT,//port number
    MONGO_URI: process.env.MONGO_URI,//mongodb uri
    JWT_SECRET: process.env.JWT_SECRET,//jwt secret
    connectDB
};
