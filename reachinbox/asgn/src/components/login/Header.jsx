import React from 'react'
import logo from '../../assets/logo.png'

function Header() {
  return (
    <div className='border-[#25262B] bg-black border-b-2 fixed text-white h-16 w-screen flex items-center justify-center'>
        <img src={logo} 
            alt='logo' 
            className='h-24'
        />
      
    </div>
  )
}

export default Header
