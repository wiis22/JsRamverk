// src/pages/checkLoggedIn.js

// import { useEffect } from 'react';
// import { useRouter } from 'next/router';

export default async function checkLoggedIn(){
    // const token = sessionstorage.getItem('token')
    // const [token, setToken] = useState(null);
    // const router = useRouter();
    // useEffect(() => {
    const loggedIn = async () => {
        if (typeof window !== "undefined") {
            const storedToken = sessionStorage.getItem('token') // window object doesn't exist, maybe.
            // console.log("storedToken: ", storedToken);
            if (storedToken) {
                // setToken(storedToken);
                // console.log("token: ", token);

                const response = await fetch('https://wiis22.azurewebsites.net/api/verify-logged-in', {
                    method: 'GET',
                    headers: {
                        'x-access-token': storedToken
                    }
                });
                const result = await response.json();
                // console.log("result", result)
                if (!result.loggedIn) {
                    return false;
                }

                return true;
            } else {
                return false;
            }
        }
    };
    const isLoggedIn = await loggedIn();
    return isLoggedIn;
    // });
};
