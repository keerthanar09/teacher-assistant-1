"use client";

import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import {useState, useEffect} from 'react';
// import {signIn, signOut, useSession, getProviders} from 'next-auth/react';

const NavBar = () => {
  return (

    /*justify-between makes it so that there is an equal amount of space between the items*/ 
    <nav className='flex flex-between justify-between mb-10 pt-3 ml-4 '>
        <Link href='/' className='flex gap-2 flex-center'>
            <Image src="/assets/icons/logo-black.jpg"
            alt="Teacher Assistant"
            width={30}
            height = {30}
            className ="object-contain" />
        </Link>
        <div className="flex flex-row justify-end">
          <button className = "serious-button">Log out</button>
        </div>
        
    </nav>
  )
}

export default NavBar