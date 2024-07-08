import React from 'react'
import { useSelector } from 'react-redux'

function DefaultLayout({children}) {
    const {user} = useSelector(state => state.user)
  return (
    <div className='main'>
        <div className='header flex justify-between p-5 shadow items-center'>
            <h1 className='text-2xl'>Todo Application</h1>
            <div className='flex items-center gap-2'> 
                <h1 className='text-xl'>{user?.name.toUpperCase()}</h1>
                <i className="ri-logout-box-r-line"></i>
                <button className='bg-blue-500 p-2 rounded-lg text-yellow-50 cursor-pointer'
                onClick={()=>{
                    localStorage.removeItem('token')
                    window.location.reload()
                }}
                >
                    LOGOUT
                </button>
            </div>

        </div>
        <div className='content m-2 '>
    
            {children}
        </div>
    </div>
  )
}

export default DefaultLayout