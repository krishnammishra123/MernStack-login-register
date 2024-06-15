import React, { useState } from 'react';
import './ForgotPassword.css';
import swal from "sweetalert";
import { forgotPasswordValidation } from '../Validation/Validation';
import { forgotPasswordService } from '../Service/Service';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email,setEmail]=useState("");
  const [error,setError]=useState({});
 
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
   const userDetails={email};
   const validate= await forgotPasswordValidation(userDetails);
   setError(validate);
   if(Object.keys(validate).length === 0){
   const res = await  forgotPasswordService(userDetails);
   if(res.data){
    const { message } = res.data;
   console.log(res.data);
   swal({ title: "Success", text: message, icon: "success", button: "Ok",});
   setEmail("")
   }
   }
    }catch(err){
      if (err.response) {
        const { status, message } = err.response.data;
        if (status === 400 || status === 403 || status === 404 || status === 409 ) {
        swal({ title: "Wrong Entry", text: message, icon: "warning", button: "Ok",});
        }else {
        console.log(err)
        }
      }
    }
  }
  
  return (
    <div className='ForgotPassword'>
    <div className="ForgotPassword-form">
      <p className='text-center font-bold text-xl'>Forgot Password Page</p>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label className='title'>Email </label>
          <input type="email" name="email"  placeholder='Enter email' autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)}  />
          {error?.email && <span className='text-red-500'>{error.email}</span>}
        </div>
        <div className="button-container ">
          <button type="submit" >Reset</button>
        </div>
      </form>
      <p className='pt-3 text-center'>Back to<Link to="/"><span className='text-green-500'> Sign In</span></Link></p>
    </div>
    </div>
  )
}

export default ForgotPassword;