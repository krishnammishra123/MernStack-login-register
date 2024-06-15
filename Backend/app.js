import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import appRoot from "app-root-path";
import * as path from "path";
 
dotenv.config();

import AuthRouter from "./router/AuthRouter.js";
import UserRouter from "./router/UserRouter.js";
import AdminRouter from "./router/AdminRouter.js";


const app = express();
const Port = process.env.DATABASE_PORT || 3001;

// Join the paths correctly
app.use(express.static(path.join(appRoot.path + "uploads/htmlTemplate")));
app.use(express.static(path.join(appRoot.path + "uploads/image")));

app.use('/uploads/image', express.static('uploads/image'));
 
app.use(express.json());
app.use(cors({origin : process.env.FRONTEND_URL || "*"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true  }));

app.use("/auth",AuthRouter);
app.use("/user",UserRouter);
app.use("/admin",AdminRouter);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI).then(() => {
app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
    console.log("Successfully connected to the MongoDB server");
    });
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
});
