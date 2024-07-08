import React, { useState } from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const[user,setUser]=useState({
  email:"",
  password:"",
  });

  const login = async() => {
    // console.log(login)
    try{
      dispatch(ShowLoading())
      const response = await axios.post("/api/users/login",user);
      dispatch(HideLoading())
      if(response.data.success){
        toast.success(response.data.message)
        localStorage.setItem("token",response.data.data)
        navigate('/');
      }else{
        toast.error(response.data.message)
      }
    }catch(error){
    toast.error('Something went wrong')
    dispatch(HideLoading())
    console.log(error)
     
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='flex flex-col gap-5 w-96 p-3 shadow border border-gray-300'>
      <h1 className='text-3xl font-bold'>Login</h1>

      <hr/>
  
     
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
      
        
        <button className='primary'
        onClick={login}
        >login</button>
      
       
        <div className='flex flex justify-between'>
        <label htmlFor="">Not register yet ?</label>
        <Link to='/register' className="text-gray-500">Click To SignUp</Link>
        </div>
        
       
      </div>
    </div>
  )
}

export default Login