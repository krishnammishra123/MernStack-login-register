import React, { useState } from 'react';
import './Register.css';
import swal from "sweetalert";
import { registerValidation } from '../Validation/Validation';
import { googleLoginService, registerService } from '../Service/Service';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [email,setEmail]=useState("");
  const [role]=useState("user");
  const [password,setPassword]=useState("");
  const [error,setError]=useState({});
  const navigate = useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
   const userDetails={firstName,lastName,email,password,role};
   const validate= await registerValidation(userDetails);
   setError(validate);
   if(Object.keys(validate).length === 0){
   const res = await  registerService(userDetails);
   if(res.data){
    const { message } = res.data;
   console.log(res.data);
   swal({ title: "Success", text: message, icon: "success", button: "Ok",});
   setFirstName("");
   setLastName("");
   setEmail("");
   setPassword("");
   }
   }
    }catch(err){
      if (err.response) {
        const { status, message } = err.response.data ;
        if (status === 400 || status === 403 || status === 404 || status === 409 ) {
        swal({ title: "Wrong Entry", text: message, icon: "warning", button: "Ok",});
        }else {
        console.log(err)
        }
      }
    }
  }


  const handleGoogleSubmit = async (profile) => {
    try {
      const userDetails = {
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        oAuthId: profile.sub,
        role: localStorage.getItem("role") ?? "user",
      };
      const res = await googleLoginService(userDetails);
      console.log(res.data);
      const { token, user } = res.data;
      if (user.role === "user") {
        localStorage.setItem("token", token);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);
        localStorage.setItem("id", user.id);
        localStorage.setItem("firstName", user.firstName);
        localStorage.setItem("lastName", user.lastName);
        navigate("/userHome");
      }
    } catch (err) {
      if (err.response) {
        const { status, message } = err.response.data;
        if (status === 400 || status === 403 || status === 404 || status === 409 ) {
        swal({ title: "Wrong Entry", text: message, icon: "warning", button: "Ok",});
        }else {
        console.log(err)
        }
      }
    }
  };



  const Login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,

            },
          }
        );
        handleGoogleSubmit(res.data);
      } catch (err) {
        console.log(err);
      }
    },
    onError: (error) => console.log('Login Failed:', error),
  });
  
  return (
    <div className='Register'>
    <div className="register-form">
    <p className='text-center font-bold text-xl'>Sign Up Page</p>
      <form onSubmit={handleSubmit}>
      <div className="input-container">
          <label className='title'>FirstName </label>
          <input type="text" name='firstName'  placeholder='Enter firstName' autoComplete="given_name" aria-autocomplete="list" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
        </div>
       {error?.firstName  && <span className='text-red-500'>{error.firstName}</span>}
       <div className="input-container">
          <label className='title'>LastName </label>
          <input type="text" name='lastName'  placeholder='Enter lastName' autoComplete="family_name" aria-autocomplete="list" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
        </div>
       {error?.lastName && <span className='text-red-500'>{error.lastName}</span>}
        <div className="input-container">
          <label className='title'>Email </label>
          <input type="email" name="email"  placeholder='Enter email' autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)}  />
        </div>
        {error?.email   && <span className='text-red-500'>{error.email}</span>}
        <div className="input-container">
          <label className='title'>Password </label>
          <input type="password" name="password" placeholder='Enter password' autoComplete="new-password"  value={password} onChange={(e)=>setPassword(e.target.value)}  />
        </div>
        {error?.password && <span className='text-red-500'>{error.password}</span>}
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
      <p className='pt-3 text-center'>I have already account?<Link to="/"><span className='text-green-500'> Sign In</span></Link></p>
      <button onClick={Login} className="flex items-center justify-center text-center flex-row font-bold m-auto p-2 bg-gray-500">
        <img src="../assets/images/loginImages/googleimge.png" alt="Google" width="30" height="30"  /> 
        <span  className='text-white'> Continue with Google</span>
        </button>
    </div>
    </div>
  )
}

export default Register;