import Layout from "@layouts/layout";
import useAuth from "@hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function RoomPage() {
    const { user, loading } = useAuth("TEACHER");
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const [load, setLoad] = useState(true);


    async function fetchQuestions(){
        setLoad(true)
        try{
            const res = await fetch(`${BASE_URL}/api/question/${id}`)

        }catch (error){

        }
    }

    if (loading || !router.isReady) return null;
    return(
        <Layout isAuth={true} role="TEACHER">
            quiz page
        </Layout>
    )
}