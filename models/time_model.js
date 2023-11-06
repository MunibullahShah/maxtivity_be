const mongoose = require('mongoose');

const TimeModel= mongoose.model('Time', new mongoose.Schema({
    startTime:{
        type:Date,
        default:Date.now
    },
    endTime:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}));

module.exports.TimeModel=TimeModel;