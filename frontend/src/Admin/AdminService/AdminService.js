import axiosInstance from "../../Interceptor/Interceptor";

export const getAdminDetails=async()=>{
    const res = await axiosInstance.get("/admin/getAdminDetails");
    return res;
}


export const getAllUsers=async(page,limit,search)=>{
    const res = await axiosInstance.get(`/admin/getAllUsers?page=${page}&limit=${limit}&search=${search}`);
    return res;
}


export const deleteUsers = async(id)=>{
    const res = await axiosInstance.delete(`/admin/deleteUser/${id}`);
    return res;
}