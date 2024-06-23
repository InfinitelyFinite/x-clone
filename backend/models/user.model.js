import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    fullName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    // followers and following will be arrays of UserIDs
    followers:[
        {
        // a follower will be a type of ID
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
        // a follower will be a type of ID
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    profileImg:{
        type:String,
        default:"",
    },
    coverImg:{
        type:String,
        default:"",
    },
    bio:{
        type:String,
        default:"",
    },
    link:{
        type:String,
        default:"",
    },
    // timestamps auto adds two fields: createdAt and updatedAt
},{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;
