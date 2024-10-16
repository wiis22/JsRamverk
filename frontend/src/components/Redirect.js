// src/components/Redirect.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const RedirectComp = ({ route, verify=false }) => {
    const router = useRouter();

    if (verify) {
        fetchLoggedIn = async () => {
            const response = await fetch('http://localhost:1337/api/verify-logged-in', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            });
            const result = await response.json();
    
            if (!result.loggedIn) {
                router.push("/login");
            }
        };

        fetchLoggedIn();
    }

    useEffect(() => {
        router.push(`${route}`)
    }, [route, router]);

    return <div>Throbbing .... </div>
};

export default RedirectComp;
