import Link from 'next/link';
import React from "react";
import Layout from '@layouts/layout';


export default function About() {
  return (
    <Layout isAuth = {false}>
    <div className="h-screen bg-dark text-white flex flex-col items-center justify-center">
      About page
    </div>
    </Layout>
  );
}

