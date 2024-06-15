import React, {useEffect, useRef, useState } from 'react'
import './VerifyEmail.css';
import { useParams } from 'react-router-dom'
import { getEmailVerifyService } from '../Service/Service';

const VerifyEmail = () => {
    const {token}=useParams();
    const [verificationStatus, setVerificationStatus] = useState("pending");
    const [error, setErrors] = useState("");
    const initialized = useRef(false);

    useEffect(()=>{
      if(!initialized.current){
        initialized.current=true;
          getVerifyEmail();
      }
  })


    const getVerifyEmail = async () => {
        try{
          const res = await getEmailVerifyService(token);
          if (res.data.status === 200) {
          setVerificationStatus("success");
          } 
        }catch(err){
          setVerificationStatus("expired");
          setErrors("This link has been expired.");
          console.log(err);
        }
    };






  return (
    <div className='Verify'>
        <div className='verifyEmail'>
            {
                verificationStatus === "success" ?(<>
                <p className="text-xl">
                Your email has been successfully verified.
                </p>
                <p className="text-center text-green-500">
                <a href="/"> Continue to Login</a>
                </p></>)
                : verificationStatus === "expired" ? (<> 
                <p className='text-center text-3xl font-bold'>Oops</p>
                <h2 className="text-xl pt-2">
                 Verification Link Expired!
                </h2>
                <p className="text-center pt1">{error}</p>
                </>) 
                 : ""
           }       
        </div>
    </div>
  )
}

export default VerifyEmail