import axios from "axios";
// import { toast } from "react-toastify";
import swal from "sweetalert";



// Create a new instance of Axios with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  // withCredentials: true,
});

 
// Add a request interceptor to handle errors globally
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    //   config.headers["x-api-key"] = process.env.REACT_APP_VALID_X_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful response data
    if (
      response.data.status === 200 || response.data.status === 201 || response.status === 200 || response.status === 201
    ) {
      return response;
    }
  },
  (error) => {  
    const { statusCode,status,message} = error.response.data;
 
    if (  statusCode === 401 || status === 401) {
        localStorage.clear();
        swal({
          title: "Unauthorized",
          text: message || "Your session has expired. Please log in again.",
          icon: "error",
          button: "Ok",
        }).then(() => {
          window.location.href = "/";
        });
    } 
    return Promise.reject(error);
    // if (status === 400 || status === 403 || status === 409 ||status === 403 ) {
    //   swal({ title: "Wrong Entry", text: message,icon: "warning", button: "Ok",});
    // } else if ( error.response.data.statusCode === 401 || error.response.status === 401) {
    //   swal({  title: "Wrong Entry",  text: message,  icon: "warning",  button: "Ok", });
    // } else {
    //   swal({
    //     title: "Wrong Entry", text: message,
    //     icon: "warning",
    //     button: "Ok",
    //   });
    // }
  }
);

export default axiosInstance;
