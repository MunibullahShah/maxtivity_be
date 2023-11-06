const router = require('express').Router();
const { TimeModel } = require('../models/time_model');
const { User,verifyToken } = require('../models/user_model');


router.post('/createSlot', async (req, res) => {
    try {
        const startTime=req.body.startTime;
        const endTime=req.body.endTime;
        const token=req.header('x-auth-token');
        const user=await verifyToken(req);
        if(!user){
            return res.status(401).send({ error: "Not authenticated" });
        }
        const time = new TimeModel({startTime:startTime,endTime: endTime, user: user });
        await time.save();
        return res.status(200).send({ message: "Time saved successfully" });
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
});

router.get('/getSlots',async (req,res)=>{
    try{
        const token=req.header('x-auth-token');
        const user=await verifyToken(req);
        if(!user){
            return res.status(401).send({ error: "Not authenticated" });
        }
        const timeStamps=await TimeModel.find({user:user._id});
        return res.status(200).send({data:timeStamps});
    }catch (e) {
        return res.status(400).send({ error: e.message });
    }
});

router.delete('/deleteSlot',async (req,res)=>{
    try{
        const token=req.header('x-auth-token');
        const user=await verifyToken(token);
        if(!user){
            return res.status(401).send({ error: "Not authenticated" });
        }
        const timeSlot=await TimeModel.findByIdAndDelete(req.body.id);
        if(!timeSlot){
            return res.status(400).send({ error: "Time slot not found" });
        }
        return res.status(200).send({message:"Time slot deleted successfully"});
    }catch (e) {
        return res.status(400).send({ error: e.message });
    }
});


module.exports = router;