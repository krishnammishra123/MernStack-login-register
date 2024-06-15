import axiosInstance from "../../Interceptor/Interceptor";


export const registerService = async (userdetails) => {
    const res = await axiosInstance.post("/auth/signUp", userdetails);
    return res;
};


export const googleLoginService = async (userdetails) => {
    const res = await axiosInstance.post("/auth/googleLogin", userdetails);
    return res;
};

export const loginService = async (userdetails) => {
    const res = await axiosInstance.post("/auth/signIn", userdetails);
    return res;
};

export const getEmailVerifyService=async(token)=>{
    const res = await axiosInstance.get(`/auth/emailVerify/${token}`);
    return res;
}


export const forgotPasswordService = async (userdetails) => {
    const res = await axiosInstance.post("/auth/forgotPassword", userdetails);
    return res;
};

export const resetPasswordService = async (userdetails,id,token) => {
    console.log(userdetails)
    const res = await axiosInstance.post(`/auth/resetPassword/${id}/${token}`, userdetails);
    return res;
};


