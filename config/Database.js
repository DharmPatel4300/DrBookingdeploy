const mongoose = require('mongoose');
const url = process.env.DB_URL;


const connectDB = async function connectMongoose() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        //console.log("Database connection stablished");
        
    } catch (error) {
        //console.log("Database onnection error")
    }
}



module.exports = connectDB;