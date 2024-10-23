// src/pages/login.js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import loggedIn from '@/utils/checkLoggedIn';
import RedirectComp from '@/components/Redirect.js';

export default function Login() {
    const router = useRouter();
    // const [token, setToken] = useState(null);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [okToken, setOkToken] = useState(false);
    const [newToken, setNewToken] = useState(null);
    const [isSubmitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        const verifyLoggedIn = async () => {
            const isLoggedIn = await loggedIn();
            // console.log("isLoggedIn i login:", isLoggedIn);
            setOkToken(isLoggedIn);
        }
        verifyLoggedIn();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        setSubmitted(true);

        console.log("inne i handlelogin");

        const loginData = {
            email: user,
            password: password
        };

        try {
            console.log("inne i try i handlelogin");

            const response = await fetch('http://localhost:1337/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                console.log("response.ok not ok")
                throw new Error(`HTTP error, status ${response.status}`);
            }

            const jwtToken = await response.json();

            if (jwtToken === "Couldn't find user data based on email") {
                setErrorMessage("NO user by that email/username.")
                setSubmitted(false);

                setTimeout(() => {
                    setErrorMessage("")
                }, 3000)

                setUser("");
                setPassword("");
                return;
            }

            if (!jwtToken) {
                setErrorMessage("Password incorrect.")
                setSubmitted(false);

                setTimeout(() => {
                    setErrorMessage("")
                }, 3000)

                setUser("");
                setPassword("");
                return;
            }

            console.log("jwttoken: ", jwtToken);


            setNewToken(jwtToken);
            sessionStorage.setItem('token', jwtToken);
            sessionStorage.setItem('user', user);

        } catch (err) {
            console.log("this happens when error fetching api/login")
            //maby check what whent wrong like incorrect username/password.
            console.error("Fetch error:", err)
        }
    }


    const handleRegister = async (e) => {
        e.preventDefault();
        router.push("/register");
    }


    return (
        <div className='login'>
            {okToken ? (
            <h1>Already logged In!</h1>
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
                                            type="password"
                                            value={password}
                                            placeholder='******'
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

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
