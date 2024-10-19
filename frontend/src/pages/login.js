// src/pages/login.js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import loggedIn from '@/utils/checkLoggedIn';

export default function Login() {

    const router = useRouter();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [okToken, setOkToken] = useState(false);
    const [newToken, setNewToken] = useState(null);
    const [isSubmitted, setSubmitted] = useState(false);

    const loggedIn = async () => {
        // const token = sessionstorage.getItem('token')
        const [token, setToken] = useState(null);

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

            if (result.loggedIn) {
                setOkToken(true)
            }
        }
    };

    loggedIn();



    const handleLogin = async (e) => {
        e.preventDefault();

        setSubmitted(true);
        const loginData = {
            email: user,
            password: password
        };

        try {
            const response = await fetch('http://localhost:1337/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error, status ${response.status}`);
            }

            const jwtToken = await response.json();

            //set the jwt token to session storage.

            console.log("redirecting to /home  the jwttoken: " + jwtToken);
            // return redirect(`/doc/${newDocId}`);
            setNewToken(jwtToken);
            sessionStorage.setItem('token', jwtToken)

        } catch (err) {
            //maby check what whent wrong like incorrect username/password.
            console.error("Fetch error:", err)
        }
    }


    const handleRegister = async (e) => {
        e.preventDefault();
        router.push("/register");
        //need to redirect to a /register
    }


    return (
        <div className='login'>
            {okToken ? (
            <p>Already logged In!</p>
            ) : (
                <div>
                    <h1>Login</h1>
                    {newToken ? (
                        <RedirectComp route={"/"} />
                    ) : (
                        <div>
                            <div className='login-form'>
                                <form onSubmit={handleLogin}>
                                    <div>
                                    <label>Username: </label>
                                    <input className='textarea'
                                            type="text"
                                            value={user}
                                            placeholder='email/username'
                                            onChange={(e) => setUser(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                    <label>Password: </label>
                                    <input className='textarea'
                                            type="text"
                                            value={password}
                                            placeholder='******'
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button className='new-doc-button' type="submit" disabled={isSubmitted}>Login</button>
                                </form>
                            </div>
                            <div className='new-register'>
                                <button className='new-doc-button' type="submit" onClick={handleRegister}>Register</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
