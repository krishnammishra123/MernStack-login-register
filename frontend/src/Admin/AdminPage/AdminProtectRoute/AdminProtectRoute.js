 import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext/AuthContext';
import Loading from '../../../Pages/Loading/Loading';
 
 

const AdminProtectRoute = (props) => {
     const { Component } = props;
     const {authorize ,loading}=useAuth()
     const role= localStorage.getItem("adminRole");
     
     if (loading) {
        return <div><Loading/></div>; // Or a loading spinner
    }
    return (
        <div> {role === "admin" && authorize === true  ?  <Component/> : (<Navigate to="/"/>)} </div>
    );
};

export default AdminProtectRoute;
