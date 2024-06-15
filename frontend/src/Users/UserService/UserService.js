import axiosInstance from "../../Interceptor/Interceptor";


export const getUserDetails=async()=>{
    const res = await axiosInstance.get("/user/getUserDetails");
    return res;
}


export const uploadProfileImage=async(formData)=>{
    const res = await axiosInstance.post("/user/uploadUserProfile",formData);
    return res;
}