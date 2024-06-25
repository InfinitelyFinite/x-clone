import express from "express";
import authRoute from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import { v2 as cloudinary } from "cloudinary";

const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// middleware for parsing req.body
app.use(express.json());
app.use(express.urlencoded({extended: true})); // to parse form data(urlencoded)
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
