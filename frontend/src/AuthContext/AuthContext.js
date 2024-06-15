// src/AuthContext/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import swal from 'sweetalert';
import { getAdminDetails } from '../Admin/AdminService/AdminService';
import { getUserDetails } from '../Users/UserService/UserService';

export const AuthProvider = createContext();

const AuthContext = ({ children }) => {
  const [authorize, setAuthorize] = useState(false);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role") || localStorage.getItem("adminRole");

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        if (role === "user") {
          const res = await getUserDetails();
          if (res.data) {
            setAuthorize(true);
          }
        } else if (role === "admin") {
          const res = await getAdminDetails();
          if (res.data) {
            setAuthorize(true);
          }
        } else {
          setAuthorize(false);
          localStorage.clear();
        }
      } catch (err) {
        if (err.response) {
          const { status, message } = err.response.data;
          if ([400, 403, 404, 409].includes(status)) {
            swal({ title: "Wrong Entry", text: message, icon: "warning", button: "Ok" });
          } else {
            console.error(err);
          }
        } else {
          console.error(err);
        }
        setAuthorize(false);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [role]);

  return (
    <AuthProvider.Provider value={{ authorize, setAuthorize, loading }}>
      {children}
    </AuthProvider.Provider>
  );
};

export default AuthContext;

export const useAuth = () => useContext(AuthProvider);
