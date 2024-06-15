import React, { useState } from 'react';
import './ResetPassword.css';
import swal from "sweetalert";
import { resetPasswordValidation } from '../Validation/Validation';
import { resetPasswordService } from '../Service/Service';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [error,setError]=useState({});
  const navigate = useNavigate();
  const {id,token}=useParams();
 
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
   const userDetails={password,confirmPassword};
   const validate= await resetPasswordValidation(userDetails);
   setError(validate);
   if(Object.keys(validate).length === 0){
   const res = await  resetPasswordService(userDetails,id,token);
   if(res.data){
    const { message } = res.data;
   console.log(res.data);
   swal({ title: "Success", text: message, icon: "success", button: "Ok",}).then(() => {
    setPassword("");
    setConfirmPassword("");
    navigate("/"); 
  });
   setPassword("");
   setConfirmPassword("")
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
    <div className='ResetPassword'>
    <div className="ResetPassword-form">
    <p className='text-center font-bold text-xl'>Reset Password Page</p>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label className='title'>Password </label>
          <input type="password" name="password" placeholder='Enter password' autoComplete="new-password"  value={password} onChange={(e)=>setPassword(e.target.value)}  />
          {error?.password && <span className='text-red-500'>{error.password}</span>}
        </div>
        <div className="input-container">
          <label className='title'>ConfirmPassword </label>
          <input type="password" name="confirmPassword"  placeholder='Enter confirmPassword' autoComplete="new-password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}  />
          {error?.confirmPassword && <span className='text-red-500'>{error.confirmPassword}</span>}
        </div>
        <div className="button-container ">
          <button type="submit" > Change Password </button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default ResetPassword;