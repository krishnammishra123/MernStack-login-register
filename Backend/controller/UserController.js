import appRoot from "app-root-path";
import * as path from "path";
import * as fs from "fs"; 
import User from "../schema/UserSchema.js";
 


export const  getUserDetails = async(req,res) =>{
    try{   
        const user = await User.findOne({ _id: req.userId});
        const details ={
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            id:user._id,
            role:user.role,
            image: user.image !== null ? `${process.env.BACKEND_URL}/${user.image}`: null 
        }
        if(!user){
            return res.status(404).json({message:"user not found",status:200})
        }
       return res.status(200).json({message:details,status:200})
      }catch(err){
        console.log(err)
       return res.status(500).json({ message: "Something went wrong while getUserDetails", status: 500 });
    }
}


export const  uploadUserProfileImage = async(req,res) =>{
    try{    
      const { filename } = req.file;
      const user = await User.findOne({ _id: req.userId}); 
   if(user){
    let previousImage = "";
    if (user.image) {
      previousImage = path.join(appRoot.path, "uploads/image", user.image);
      if (fs.existsSync(previousImage)) {
        fs.unlinkSync(previousImage);
      }
    }
    const srchQuery = { _id: req.userId },
    updateQuery = {
      $set: {
        image:filename,
      },
    };
    const updatedUser = await User.findByIdAndUpdate(srchQuery,updateQuery,{new:true});
 
    const details ={
        firstName:updatedUser.firstName,
        lastName:updatedUser.lastName,
        email:updatedUser.email,
        id:updatedUser._id,
        role:updatedUser.role,
        image: updatedUser.image !== null ? `${process.env.BACKEND_URL}/${updatedUser.image}`: null
    }
       return res.status(200).json({ message: "image Updated Successfully",data:details, status: 200 })
   }
      }catch(err){
        return res.status(500).json({ message: "Something went wrong while upload User Profile Image", status: 500 });
    }
}