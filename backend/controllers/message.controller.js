import {Conversation} from '../models/conversation.model.js';
import {Message} from '../models/message.model.js'
import { io, getReceiverSocketId } from '../socket/socket.js';

//send message
export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {textMessage :message} = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId]
            });
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });
        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        // await conversation.save();
        // await newMessage.save();
        await Promise.all([conversation.save(),newMessage.save()]);

        //implement socket.io for real time messages
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage);
        }


        return res.status(201).json({
            success: true,
            newMessage,
        });

    } catch (err) {
        console.log(err);
    }
}

//receive message
export const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate('messages');

        if(!conversation){
            return res.status(200).json({
                success: true,
                messages: []
            });
        }

        return res.status(200).json({
            success: true,
            messages: conversation?.messages
        });

    } catch (err) {
        console.log(err);
    }
}