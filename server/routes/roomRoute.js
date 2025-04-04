const express = require("mongoose")
const Message = require("../models/messages")
const Room = require("../models/room")

const router = express.Router();


router.post("/create", async (req, res) =>{
    try{
        const {roomName, users} = req.body;
        if (!roomName || !users.length){
            return res.status(400).json({message:"room name and users are required"})
        }
        const room = await Room.create({roomName, users})
        res.status(201).json(room)
    }catch(err){
        console.log(err)
    }
})

router.get("/", async(req, res)=>{
    try{
        const rooms = await Room.find().populate("users", "username email")
        res.status(200).json(rooms)
    }catch(err){
        console.log(err)
    }
})

router.delete("/:roomId", async(req, res) =>{
    try{
        const {roomId} = req.params;
        await Room.findByIdAndDelete(roomId)
        await Message.deleteMany({roomId})
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router;
