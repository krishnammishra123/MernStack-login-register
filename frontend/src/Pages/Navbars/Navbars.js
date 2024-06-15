import React from 'react'
import { Link, NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Navbars = () => {
  const adminRole= localStorage.getItem("adminRole");
  const role= localStorage.getItem("role");


  
  return (
    <Navbar bg="dark" data-bs-theme="dark">
    <Container className='mt-1 mb-1'>
      <NavLink to="#home" className="text-white no-underline text-2xl">DeMo.Com</NavLink>
      <Nav className="ml-auto gap-3 ">
    {role === "user"  &&  <Link to="/userHome" className='no-underline text-white font-sans text-xl'>UserHome</Link>}
    {adminRole === "admin"  &&  <Link to="/adminHome" className='no-underline text-white font-sans text-xl'>AdminHome</Link>}
    {adminRole === "admin"  &&  <Link to="/manageUsers" className='no-underline text-white font-sans text-xl'>ManageUsers</Link>}
      <Link to="/logout" className='no-underline text-white font-sans text-xl' >Logout</Link>
      </Nav>
    </Container>
  </Navbar>
  )
}

export default Navbars