// src/pages/checkLoggedIn.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default async function loggedIn(){
    // const token = sessionstorage.getItem('token')
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = sessionStorage.getItem('token') // window object doesn't exist, maybe.

            if (storedToken) {
                setToken(storedToken);
            }
        }

    }, []);

    if (token) {
        const response = await fetch('http://localhost:1337/api/verify-logged-in', {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        });
        const result = await response.json();

        if (!result.loggedIn) {
            router.push("/login");
        }
    } else {
        router.push("/login");
    }
};
