import React from 'react'
import Layout from '@layouts/layout'
import useAuth from "@hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  const {user, loading} = useAuth("STUDENT");

  return (
    <Layout isAuth={true} role="STUDENT">
      <div className='flex flex-col'>
        <h1 className="text-5xl mb-6 text-center font-mono font-bold">
          Profile
        </h1>
        <div className='mx-auto'>
          <h3>Name: {user.name}</h3>
          <h3>Role: {user.role}</h3>
          <h3>Email: {user.email}</h3>
        </div>

      </div>
    </Layout>
    
  )
}
