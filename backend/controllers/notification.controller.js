import express from "express";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = async(req, res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        const notifications = await Notification.find({to: userId}).sort({createdAt: -1}).populate({
            path: "from",
            select: "username profileImg",
        });
        await Notification.updateMany({to:userId}, {read:true});
        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications function", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
};
export const deleteNotifications = async(req, res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        await Notification.deleteMany({to: userId});
        res.status(200).json({message: "Notifications deleted successfully"});
    } catch (error) {
        console.log("Error in deleteNotifications function", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
};

// export const deleteNotification = async(req, res) =>{
//     try {
//         const notificationId = req.params.id;
//         const userId = req.user._id;
//         const notification = await Notification.findById(notificationId);
//         if(!notification){
//             return res.status(404).json({error: "Notification not found"});
//         }
//         if(notification.to.toString() !== req.user._id.toString()){
//             return res.status(403).json({error: "Cannot delete a notification that is not yours"});
//         }
//         await Notification.findByIdAndDelete(notificationId);
//         res.status(200).json({message: "Notification deleted succesfully"});
//     } catch (error) {
//         console.log("Error in deleteNotification function", error.message);
//         return res.status(500).json({error: "Internal Server Error"});
//     }
// };