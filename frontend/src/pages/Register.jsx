import React, { useState } from 'react'
import axios from "axios"
import {Link} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { ShowLoading,HideLoading } from '../redux/alertsSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user,setUser] = useState({
    name:"",
    email:"",
   password:"",
  });

  const register =  async()  => {
    // console.log(register)
    try{
      dispatch(ShowLoading());
      const response = await axios.post("/api/users/register",user);
      dispatch(HideLoading());
      if(response.data.success){
        toast.success(response.data.message)
        navigate('/login');
      }else{
        toast.error(response.data.message)
      }
    }catch(error){
      toast.error('Something went wrong');
      dispatch(HideLoading());
      console.log(error)
     
    }
  }


  return (
    <div className='min-h-screen flex items-center justify-center'>
    <div className='flex flex-col gap-5 w-96 p-3 shadow border border-gray-300'>
    <h1 className='text-3xl font-bold'>Register</h1>
    <hr/> 

    <input
        type='text' 
        placeholder='username' 
        required
        value={user.name}
        onChange={(e)=>setUser({...user,name:e.target.value})}
        />

       <input 
        type='text' 
        placeholder='Email' 
        required
        value={user.email}
        onChange={(e)=>setUser({...user,email:e.target.value})}
        />
       <input 
        type='password' 
        placeholder='password' 
        required
        value={user.password}
        onChange={(e)=>setUser({...user,password:e.target.value})}
        />
    
    <button className='primary' onClick={register}>Register</button>
    <Link to='/login' className="text-gray-500">Login</Link>
    </div>
  </div>
  )
}

export default Register