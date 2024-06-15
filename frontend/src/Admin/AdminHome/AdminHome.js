import React, { useEffect , useState } from 'react'
import './AdminHome.css';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import Navbars from '../../Pages/Navbars/Navbars';
import { getAdminDetails } from '../AdminService/AdminService';

const AdminHome = () => {
    const [userData ,setUserData]=useState("");

      useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const res = await getAdminDetails();
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
    





  return (
    <div>
        <Navbars/>
         <div className='mt-10 d-flex flex-col justify-center text-center'>
        <p className='text-blue-500 font-serif text-3xl'>Welcome to the Admin Page</p>
        <div className="card mt-5">
        <img src="../assets/images/profile.jpeg" alt="John" style={{ width: '100%' }} />
        <h1 className='nameUser'>{userData?.firstName} {userData?.lastName}</h1>
        <p className="title">{userData?.email ?? 'undefined'}</p>
        <p className='font-serif font-bold'>Role : <span className='text-blue-500 text-xl'>{userData?.role ?? 'undefined'}</span></p>
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

export default AdminHome