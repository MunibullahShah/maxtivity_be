const express = require("express");
const {validateUser, UserModel, validateUserLogin} = require("../models/user_model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const _ = require('lodash');
const router = express.Router();



router.post('/registerUser', async (req, res) => {
try {
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }
        let user = await UserModel.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send({ error: 'User already registered' });
        } else {
            user = new UserModel(_.pick(req.body, ['name', 'email', 'password']));
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'));

            res.header('x-auth-token', token).send({
                'email': user.email,
                'token': token

            });
        }
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
});


router.post('/loginUser', async (req, res) => {
    try{
        const { error } = validateUserLogin(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }
        let user= await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ error: 'User not registered' });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'));
        const data = {

                'email': user.email,
                'token': token

        }
        res.header('x-auth-token', token).send(data);

    }catch (e){
        return res.status(400).send({ error: e.message });
    }
});


module.exports = router;