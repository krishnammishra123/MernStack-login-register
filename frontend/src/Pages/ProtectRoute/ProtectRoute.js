 import { Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext/AuthContext';
import Loading from '../Loading/Loading';
 
 

const ProtectRoute = (props) => {
     const { Component } = props;
     const {authorize ,loading}=useAuth();
     console.log(authorize)
     const role= localStorage.getItem("role");

     if (loading) {
        return <div><Loading/></div>; // Or a loading spinner
    }

    return (
        <div> {role === "user" && authorize === true ? <Component/> : (<Navigate to="/"/>)} </div>
    );
};

export default ProtectRoute;
