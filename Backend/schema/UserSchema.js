import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const UserSchema = mongoose.Schema({

    firstName:{
        type:String,
        required:[true,"firstName is required"],
        trim:true,
        lowercase:true,
    },

    lastName:{
        type:String,
        required:[true,"lastName is required"],
        trim:true,
        lowercase:true,
    },

    email:{
        type:String,
        required:[true,"emailId is required"],
        unique:true,
        lowercase:true,
    },

    password:{
        type:String,
        required:[true,"password is required"],
        trim:true,
    },

    role:{
        type:String,
        enum: ["user", "admin" ],
    },

    emailVerify:{
        type:Boolean
    },

    oAuthId:{
        type:String,
    },

    emailVerifyToken: {
        type: String,
    },
    
    forgotPasswordVerifyToken:{
        type: String,
    },

    image:{
    type:String,
    default: null,
    }


},
{ timestamps: true }
);

 
const User = mongoose.model("User",UserSchema);

export default User;