import React, { useEffect, useState } from 'react';
import './Login.css';
import swal from "sweetalert";
import { loginValidation } from '../Validation/Validation';
import { googleLoginService, loginService } from '../Service/Service';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../../AuthContext/AuthContext';

const Login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState({});
  const navigate = useNavigate();
 const {setAuthorize}=useAuth();
   
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
   const userDetails={email,password};
   const validate= await loginValidation(userDetails);
   setError(validate);
   if(Object.keys(validate).length === 0){
   const res = await loginService(userDetails);
   if(res.data){
   const { user ,token } = res.data;
   if (user.role === "user") {
     setAuthorize(true)
    // swal({ title: "Success", text: message, icon: "success", button: "Ok",});
     localStorage.setItem("token", token);
     localStorage.setItem("email", user.email);
     localStorage.setItem("role", user.role);
     localStorage.setItem("id", user.id);
     localStorage.setItem("firstName", user.firstName);
     localStorage.setItem("lastName", user.lastName);
     navigate("/userHome");
   } else if (user.role === "admin") {
    setAuthorize(true)
    localStorage.setItem("token", token);
    localStorage.setItem("email", user.email);
    localStorage.setItem("adminRole", user.role);
    localStorage.setItem("id", user.id);
    localStorage.setItem("firstName", user.firstName);
    localStorage.setItem("lastName", user.lastName);
    navigate("/adminHome");
   } else {
    swal({  title: "Unauthorized Access",  text: "You are not authorized to access this section.",icon: "error",  button: "Ok", });
  }
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

  
  const handleGoogleSubmit = async (profile) => {
    try {
      // Clear all items from local storage
      // localStorage.clear();
      const userDetails = {
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        oAuthId: profile.sub,
        role: localStorage.getItem("role") ?? "user",
      };
      const res = await googleLoginService(userDetails);
      const { token, user } = res.data;
      if (user.role === "user") {
        setAuthorize(true)
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


useEffect(()=>{
const role = localStorage.getItem("role");
const adminRole = localStorage.getItem("adminRole");
if (role === "user"){
  navigate("/userHome")
}else if(adminRole === "admin"){
  navigate("/adminHome");
} else{
  // console.log("You are not authorized to access this section.")
}
},[navigate])
 



  const isNextDisabled = () => {
    if (!password || !email) {
      return true;
    }
    return false;
  };
  
  return (
    <div className='Login'>
    <div className="login-form">
    <p className='text-center font-bold text-xl'>Sign In Page</p>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label className='title'>Email </label>
          <input type="email" name="email"  placeholder='Enter email' autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)}  />
          {error?.email && <span className='text-red-500'>{error.email}</span>}
        </div>
        <div className="input-container">
          <label className='title'>Password </label>
          <input type="password" name="password" placeholder='Enter password' autoComplete="new-password"  value={password} onChange={(e)=>setPassword(e.target.value)}  />
          {error?.password && <span className='text-red-500'>{error.password}</span>}
        </div>
        <div className="input-container">
        <Link to="/forgotPassword" className=' text-black-500 '>Forgot password?</Link>
        </div>
        <div className="button-container ">
          <button type="submit" disabled={isNextDisabled()} > Submit </button>
        </div>
      </form>
      <p className='pt-3 text-center'>Don`t have an account?<Link to="/signUp"><span className='text-green-500'> Sign up</span></Link></p>
      <button onClick={Login} className="flex items-center justify-center text-center flex-row font-bold m-auto p-2 bg-gray-500">
        <img src="../assets/images/loginImages/googleimge.png" alt="Google" width="30" height="30"  /> 
        <span  className='text-white'> Continue with Google</span>
        </button>
    </div>
    </div>
  )
}

export default Login;