const express=require('express');
const http = require("http");
const mongoose = require('mongoose');
const config = require('config');
var cors = require('cors');
require('dotenv').config();


const app=express();



app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH', 'COPY', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND', 'VIEW'],
    }
));


if (!config.get("PrivateKey")) {
    console.error("FATAL ERROR: PrivateKey is not defined");
    process.exit(1);
}



const users = require('./routes/users');
const timeslots = require('./routes/time_stamps');

app.use(express.json());
app.use('/api/users', users);
app.use('/api/timeslots', timeslots);




mongoose.connect(process.env.MONGO_URI).then(()=>{
console.log("Connected to MongoDB...");
}).catch(err=>{
    console.log("Could not connect to MongoDB...");
});

app.get('/',(req,res)=>{
    res.send('Hello World');
});





http.createServer(app).listen(3000, () => {
    console.log("Server started at port 3000");
});