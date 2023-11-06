const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require("config");

const UserModel=mongoose.model('User',new mongoose.Schema({
    name:{
        type:String,
        minlength:2,
        maxlength:50
    },
    email:{
        type:String,
        minlength:5,
        maxlength:255,
        unique:true
    },
    password:{
        type:String,
        minlength:5,
        maxlength:1024
    },
}));


function validateUser(user){
    try{
        const schema=Joi.object({
            name:Joi.string().min(2).max(50).required(),
            email:Joi.string().min(5).max(255).required().email(),
            password:Joi.string().min(5).max(255).required(),
        });
        return schema.validate(user);
    }catch (e) {
        return e.message;
    }
}

function validateUserLogin(user) {
    try {
        const schema = Joi.object({
            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().min(5).max(255).required()
        });
        return schema.validate(user);
    } catch (e) {
        throw e;
    }
}

async function verifyToken(req) {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return null;
        }

        try {
            jwt.verify(token, config.get('PrivateKey'));
        } catch (err) {
            return null;
        }

        const decoded = jwt.decode(token);
        if (!decoded || !decoded._id) {
            return null;
        }

        const user = await UserModel.findById(decoded._id );
        if (!user) {
            return null;
        }

        return user;
    } catch (e) {
        return null;
    }
}



exports.UserModel=UserModel;
exports.validateUser=validateUser;
exports.validateUserLogin=validateUserLogin;
exports.verifyToken=verifyToken;
