require('dotenv').config();
const express = require('express');
const connectDB = require('./config/Database');
const morgan = require('morgan');
const app = express();
const v1Router = require('./routes/v1/rootRoute');
const cors = require('cors');
const path = require('path');

// mongoDB connection
connectDB();

//default middlewares
app.use(express.json());
app.use(morgan("dev"));


app.use(cors()); 



// routes
app.use("/api/v1", v1Router)

//static files
app.use(express.static(path.join(__dirname,'./dist')));
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,"./dist/index.html"))
})

const port = process.env.PORT || 8080
app.listen(port,()=>{
    console.log(`Server running in ${process.env.NODE_MODE} on Port: ${port}`);
})