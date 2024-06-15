import React, { useEffect, useState } from 'react';
import './ManageUsers.css';
import Table from 'react-bootstrap/Table';
import swal from 'sweetalert';
import Navbars from '../../../Pages/Navbars/Navbars';
import { deleteUsers, getAllUsers } from '../../AdminService/AdminService';
import Pagination from '../../../Pages/Pagination/Pagination';

const ManageUsers = () => {
const [user,setUser]=useState([]);
const [page,setPage]=useState(1);
const [totalPage,setTotalPages]=useState(1);
const [search,setSearch]=useState('');
const [limit]=useState(10);


useEffect(()=>{
    const getAlluser=async()=>{
        try {
            const res = await getAllUsers(page,limit,search);
            if (res.data) {
               const { message,totalPages }=res.data;
               // Sort the users array by createdAt in descending order
              message.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              setUser(message);
              setTotalPages(totalPages);
            }  
        } catch (err) {
          if (err.response) {
            const { status, message } = err.response.data ;
            if (status === 400 || status === 403 || status === 404 || status === 409 ) {
            swal({ title: "Wrong Entry", text: message, icon: "warning", button: "Ok",});
            }else {
            console.log(err);
            }
          } 
        }
    }
    getAlluser();
},[setUser,page, limit, search])

 
 const  deleteUser=async(id)=>{
 try{
 const result= await swal({ title: "Are you sure?", text: "You want to  delete this user.", icon: "warning", buttons: ["Cancel","Ok"],dangerMode:true});
 if(result){
  if(result === true){
    const res = await deleteUsers(id);
    if (res.data) {
    const { message  }= res.data;
    const filterData =  user.filter((userId)=> userId.id !== id);
    setUser(filterData);
    swal({ title: "success", text: message, icon: "success", button: "Ok",});
   }  
   
  }else{
    return;
  }
 }
 }catch(err){
  if (err.response) {
    const { status, message } = err.response.data ;
    if (status === 400 || status === 403 || status === 404 || status === 409 ) {
    swal({ title: "Wrong Entry", text: message, icon: "warning", button: "Ok",});
    }else {
    console.log(err);
    }
  } 
 }
 }
 
  return (
    <div>
    <Navbars /> 
     <div className='mt-2 p-16'>
        <div className='float-right mb-2 '>
            <input type='text' className='p-3 h-12 w-30 border-2 border-blue-500 rounded-lg ' value={search} placeholder='Search By FirstName' onChange={(e)=>setSearch(e.target.value)} />
        </div>
     <Table striped bordered hover>
      <thead>
        <tr>
          <th>No.</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
    {user.length > 0 ?  <tbody>
        {user.map((users,index)=>(
        <tr key={index}>
          <td>{index + 1 + (page - 1) * limit}</td>
          <td>{users.firstName.charAt(0).toUpperCase() + users.firstName.slice(1)}</td>
          <td>{users.lastName}</td>
          <td>{users.email}</td>
          <td onClick={()=>deleteUser(users.id)}><i className='fa fa-trash-o text-red-500' style={{"fontSize":"24px"}} />
          </td>
        </tr>
    ))}
      </tbody> :
        <tbody>
        <tr>
            <td colSpan="5">
                <p className='font-serif text-2xl text-center'>Opps! user not found</p>
            </td>
        </tr>
    </tbody>
        }
    </Table>
    <div  >
         <Pagination page={page} totalPage={totalPage} setPage={setPage} />
    </div>
     </div>
    </div>
  )
}

export default ManageUsers