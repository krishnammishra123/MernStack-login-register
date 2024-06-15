 import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import appRoot from "app-root-path";
import * as path from "path";
import * as fs from "fs"; 
import { validationResult } from 'express-validator';
import User from "../schema/UserSchema.js";
import { sendEmailUser } from "../middleware/emailService.js";


export const  signUp = async(req,res) =>{
 
    try{ 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() ,status:400 });
      }

        const { firstName,lastName,email,password,role,} =req.body;


        var token = Buffer.from(email).toString("base64");
        token = token.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");

     const currentDate = new Date();
      // Format the date components
      const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
      const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(currentDate);
      const time = new Intl.DateTimeFormat("en-US", {hour: "2-digit",minute: "2-digit",hour12: true}).format(currentDate);

      // Create the custom format
      const formattedDate = `${month} ${day} | ${time}`;
      const url = `${process.env.FRONTEND_URL}/emailVerify/${token}`;
      const subject = "Email Verification";
  
      const filePath = path.join(appRoot.path , "uploads/htmlTemplate", "verifyEmail.html");
      const dynamicEmailTemplate = fs.readFileSync(filePath, 'utf-8');
      const dynamicContent = {
        name:firstName.charAt(0).toUpperCase() + firstName.slice(1)+" "+lastName.charAt(0).toUpperCase() + lastName.slice(1),
        formattedDate:formattedDate,
        url: url,
      };
      const html = dynamicEmailTemplate.replace(/\$\{(\w+)\}/g, (match, p1) => dynamicContent[p1]);
   


        const existUser = await User.findOne({email:email});
        if(existUser){
            if(existUser.emailVerify === true){
                return res.status(400).json({ message: "Email ID already registered - please Login", status: 400 });
            }else{
              const hashedPassword = await bcrypt.hash(password, 10);
                await User.updateOne({email:email},{emailVerifyToken: token, emailVerify: false,firstName:firstName,lastName:lastName,password:hashedPassword,role:role},{new:true});

                const message ="Check your email and click the verification link to activate your account.";
                const emailConfirmation = await sendEmailUser(email,subject, html, message);
    
                return res.status(emailConfirmation.status).json({message:emailConfirmation.message,status:emailConfirmation.status})
            
            }
        }else{
          const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({firstName: firstName,lastName: lastName,email: email,password: hashedPassword,role: role,emailVerifyToken: token,emailVerify: false,});
            await user.save();
             
                const message ="Check your email and click the verification link to activate your account.";
                const emailConfirmation = await sendEmailUser(email, subject, html, message);
                console.log("emailConfirmation",emailConfirmation);
                return res.status(emailConfirmation.status).json({message:emailConfirmation.message,status:emailConfirmation.status})
            
        }
    }catch(err){
        console.log(err)
       return res.status(500).json({ message: "Something went wrong while signing up", status: 500 });
    }
}

export const  verifyEmail = async(req,res) =>{
    try{
        const { token } = req.params;
        const existToken = await User.findOne({emailVerifyToken:token});
        if(existToken){
            existToken.emailVerify = true;
            existToken.emailVerifyToken = null;
            await existToken.updateOne({ $set: { emailVerify: true, emailVerifyToken: null } });
            return res.status(200).json({ message: "Email verification successful", status: 200 });
        } else {
            return res.status(400).json({ message: "This link has been expired", status: 400 });
          }
    }catch(err){
        console.log(err);
       return res.status(500).json({ message: "Something went wrong while verifyEmail", status: 500 });
    }
}
 
export const  signIn = async(req,res) =>{
    try{

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() ,status:400 });
      }
    
        const { email,password } =req.body;
        const existUser = await User.findOne({email:email});
        if(!existUser){
         return res.status(404).json({ message: "your details were incorrect, please try again", status: 404 });
        } 
        if (existUser.emailVerify == false) {
          return res.status(400).json({ message:"Email id not verify. Please check your email and verfiy it first", status: 400 });;
        }
        const matchPassword = await bcrypt.compare(password, existUser.password);
         console.log(matchPassword);
        if(!matchPassword){
            return res.status(400).json({ message:"your details were incorrect, please try again", status: 400 });;
        } 
        const payload={
          id:existUser._id,
          role:existUser.role,
          email:existUser.email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
     
       const user= {
            firstName: existUser.firstName,
            lastName: existUser.lastName,
            email: existUser.email,
            id: existUser._id,
            role: existUser.role,
          }
          return res.status(200).json({ message:"User Login successfully",user:user,token, status: 200 });;
    }catch(err){
        console.log(err);
       return res.status(500).json({ message: "Something went wrong while sign In", status: 500 });
    }
}



export const  forgotPassword = async(req,res) =>{
    try{

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() ,status:400 });
      }

       const {email}=req.body;
       const existUser = await User.findOne({email:email});
       if(existUser){
    let token = Buffer.from(existUser.email + existUser.role + existUser._id).toString('base64');
    token = token.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    const srchQuery = { _id: existUser._id },
      updateQuery = {$set: {forgotPasswordVerifyToken: token,},};
    const setusertoken = await  User.findOneAndUpdate(srchQuery, updateQuery, { new: true });
    const currentDate = new Date();
    // Format the date components
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(currentDate);
    const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit",minute: "2-digit",hour12: true,}).format(currentDate);
     // Create the custom format
    const formattedDate = `${month} ${day} | ${time}`;
    const url = `${process.env.FRONTEND_URL}/resetPassword/${setusertoken._id}/${setusertoken.forgotPasswordVerifyToken}`;
    const subject = "Password Reset Request";
    //const html = ``;
    const message = "We've sent you an email - if you don't see it, please check your spam folder";
    const filePath = path.join(appRoot.path, "uploads/htmlTemplate", "resetPassword.html");
    const dynamicEmailTemplate = fs.readFileSync(filePath, 'utf-8');
  
    const dynamicContent = {
      name:existUser.firstName.charAt(0).toUpperCase() + existUser.firstName.slice(1)+" "+existUser.lastName.charAt(0).toUpperCase() + existUser.lastName.slice(1),
      formattedDate:formattedDate,
      url: url,
    };
    const html = dynamicEmailTemplate.replace(/\$\{(\w+)\}/g, (match, p1) => dynamicContent[p1]);
 
    const emailConfirmation = await sendEmailUser(email, subject, html, message);
    console.log(emailConfirmation)
    
    return res.status(emailConfirmation.status).json({message:emailConfirmation.message,status:emailConfirmation.status})
            
       }else{
        return res.status(404).json({ message: "User not found", status: 404 });
       }
    }catch(err){
        console.log(err);
       return res.status(500).json({ message: "Something went wrong while forgotPassword", status: 500 });
    }
}


export const  resetPassword = async(req,res) =>{
    try{

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() ,status:400 });
      }

        const {id,token}=req.params;
        const {password,confirmPassword}=req.body;
        const existUser = await User.findOne({_id:id,forgotPasswordVerifyToken:token});
        if(!existUser){
            return res.status(404).json({ message: "This link has been expired", status: 404 });
        }
        if (password !== confirmPassword) {
         return res.status(404).json({ message: "Passwords do not match", status: 404 });
        }
        const newPassword = await bcrypt.hash(password, 10);
        const srchQuery = { _id: id },
          updateQuery = {
            $set: {
              password: newPassword,
            },
          };
        await User.findOneAndUpdate(srchQuery, updateQuery, { new: true });
        return res.status(201).json({ message: "Your password has been changed successfully.", status: 201 });
    }catch(err){
        console.log(err);
       return res.status(500).json({ message: "Something went wrong while resetPassword", status: 500 });
    }
}



export const  googleLogin = async(req,res) =>{
  try{ 
    const { firstName,lastName,email ,role,oAuthId} =req.body;
  
    const existingUser = await User.findOne({ oAuthId: oAuthId });
 
    if(existingUser){
     const payload={id:existingUser._id, role:existingUser.role, email:existingUser.email}

     const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
   
     const user= {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          id: existingUser._id,
          role: existingUser.role,
        }
        return res.status(200).json({ message:"User Login successfully",user:user,token, status: 200 });;

    }else{
      if(email == "" ){
        const newUser = new User({firstName: firstName,lastName: lastName,email: email,emailVerify: true,password: "12",role: role,oAuthId:oAuthId});
      
        const data = await newUser.save();
    
        const payload={id:data._id, role:data.role, email:data.email,}
   
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
      
        const user= {
             firstName: data.firstName,
             lastName: data.lastName,
             email: data.email,
             id: data._id,
             role: data.role,
             oAuthId:data.oAuthId,
           }
           return res.status(200).json({ message:"User Login successfully",user:user,token, status: 200 });
      }else{
        const userEmail = await  User.findOne({ email: email });
        if (userEmail) {
          const userDetail = await User.findByIdAndUpdate({_id:userEmail._id},{
            emailVerify: true,
            oAuthId:oAuthId
          },{new:true});
 
              
        const payload={id:userDetail._id, role:userDetail.role, email:userDetail.email,}
   
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
      
        const user= {
             firstName: userDetail.firstName,
             lastName: userDetail.lastName,
             email: userDetail.email,
             id: userDetail._id, 
             role: userDetail.role,
             oAuthId:userDetail.oAuthId,
           }
           return res.status(200).json({ message:"User Login successfully",user:user,token, status: 200 });
  
        }
       else{
        const userDetail = await User.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: role,
          emailVerify: true,
          password:"11",
          oAuthId:oAuthId
        });
        const payload={id:userDetail._id, role:userDetail.role, email:userDetail.email,}
   
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
      
        const user= {
             firstName: userDetail.firstName,
             lastName: userDetail.lastName,
             email: userDetail.email,
             id: userDetail._id,
             role: userDetail.role,
             oAuthId:userDetail.oAuthId,
           }
           return res.status(200).json({ message:"User Login successfully",user:user,token, status: 200 });
       }
      }
    }
}catch(err){
  console.log(err);
 return res.status(500).json({ message: "Something went wrong while login with google", status: 500 });
}
}
