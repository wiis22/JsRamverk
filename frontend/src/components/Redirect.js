// src/components/Redirect.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const RedirectComp = ({ route }) => {
    const router = useRouter();

//     if (verify) {
//         const [token, setToken] = useState(null);
// 
//         useEffect(() => {
//             if (typeof window !== "undefined") {
//                 const storedToken = sessionStorage.getItem('token') // window object doesn't exist, maybe.
// 
//                 if (storedToken) {
//                     setToken(storedToken);
//                     fetchLoggedIn();
//                 }
//             }
// 
//         }, []);
//     
//         fetchLoggedIn = async () => {
//             const response = await fetch('http://localhost:1337/api/verify-logged-in', {
//                 method: 'GET',
//                 headers: {
//                     'x-access-token': token
//                 }
//             });
//             const result = await response.json();
//     
//             if (!result.loggedIn) {
//                 router.push("/login");
//             }
//         };
//     }
    

    useEffect(() => {
        router.push(`${route}`)
    }, [route, router]);

    return <div>Throbbing .... </div>
};

export default RedirectComp;
