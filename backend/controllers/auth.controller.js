import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";

export const signup = async(req, res)=>{ 
    try {
        const {fullName, username, email, password} = req.body;
        // see if the email is correct
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"});

        }
        // username and email must be unique
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error: "User is already taken"});
        }
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({error: "Email is already taken"});
        }
        // hash password using bcrypt package
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if(password.length < 8){
            return res.status(400).json({error: "Password must be at least 8 characters long"});
        }
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            })
        } else{
            res.status(400).json({error: "Invalid user data"});
        }
    } catch (error) {
        console.log("Error in the signup controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}
export const login = async(req, res)=>{ 
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"});
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id:user._id,
            username: user.username,
            fullName: user.fullName,
            followers: user.followers,
            email: user.email,
            profileImg: user.profileImg,
            following: user.following,
            coverImg: user.coverImg,
        })

    } catch (error) {
        console.log("Error in the login controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}
export const logout = async(req, res)=>{ 
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in the logout controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in the getMe controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}