import { useEffect, useRef, useState } from 'react';
import './UserHome.css';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import Navbars from '../../Pages/Navbars/Navbars';
import { getUserDetails, uploadProfileImage } from '../UserService/UserService';

const UserHome = () => {
  const [userData ,setUserData]=useState({});

  const fileInputRef = useRef();
 console.log(userData)
      useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const res = await getUserDetails();
                if (res.data) {
                   const { message }=res.data;
                  setUserData(message);
                }  
            } catch (err) {
              if (err.response) {
                const { status, message } = err.response.data ;
                if (status === 400 || status === 403 || status === 404 || status === 409 ) {
                swal({ title: "Wrong Entry", text: message, icon: "warning", button: "Ok",});
                }else {
                console.log(err)
                }
              } 
            }
        };
        checkAuthentication();
    }, [setUserData]);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        updateHandleImage(file);
      }
    };
   

    const handleDocumentClick =()=>{
      fileInputRef.current.click();
    }

    const updateHandleImage = async (image) => {
      try {
        const formData = new FormData();
        formData.append("fileUrl", image);
        const res = await uploadProfileImage(formData);
       
        if (res && res.data ) {
          const { data }=res.data;
          setUserData(prevUserData => ({
            ...prevUserData,
            image: data.image
          }));
        }
      } catch (err) {
        if (err.response) {
          const { status, message } = err.response.data ;
          if (status === 400 || status === 403 || status === 404 || status === 409 ) {
          swal({ title: "Wrong Entry", text: message, icon: "warning", button: "Ok",});
          }else {
          console.log(err)
          }
        } 
      }
    };
    

  return (
    <div>
      <Navbars/>
      <div className='mt-16'>
      <div className="card">
      <div className='imageContainer' style={{ position: 'relative' }}>
   {userData.image !== null ? <img src={userData.image} alt="user"  /> : <img src="../assets/images/profile.jpeg" alt="John"  />} 
    <i className="fa fa-pencil cursor-pointer" onClick={handleDocumentClick} style={{ position: 'absolute', bottom: '-1px', height:"40px", width:"35px",textAlign:"center", right: '85px', color:"blue", backgroundColor: 'white', borderRadius: '50%', padding: '10px', fontSize:"20px" }}></i>
    <input type='file' ref={fileInputRef} onChange={handleFileChange} style={{display :"none"}}  />
    </div>

        <h1 className='nameUser'>{userData?.firstName} {userData?.lastName}</h1>
        <p className="title">{userData?.email}</p>
        <p className='font-serif font-bold'>Role : <span className='text-blue-500 text-xl'>{userData?.role}</span></p>
        <div style={{ margin: '24px 0' }}  >
          <Link to="#" className='pr-2'><i className="fa fa-dribbble"></i></Link>
          <Link to="#" className='pr-2'><i className="fa fa-twitter"></i></Link>
          <Link to="#" className='pr-2'><i className="fa fa-linkedin"></i></Link>
          <Link to="#" className='pr-2'><i className="fa fa-facebook"></i></Link>
        </div>
        <p><button>Contact</button></p>
      </div>
    </div>
      </div>
  )
}

export default UserHome