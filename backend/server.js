import express from "express";
import authRoute from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();
// middleware for parsing req.body
app.use(express.json());
app.use(express.urlencoded({extended: true})); // to parse form data(urlencoded)
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});
