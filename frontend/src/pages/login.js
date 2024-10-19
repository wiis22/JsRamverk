// src/pages/login.js

import React, { useEffect, useState } from 'react';
// import { useHistory } from "react-router-dom";
// import { useRouter } from 'next/router';
// import RedirectComp from '@/components/RedirectDocId';

// import { useParams } from 'react-router-dom';

export default function Login() {
    // let history = useHistory();
    // // const router = useRouter();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [newDocId, setNewDocId] = useState(null);
    const [newToken, setNewToken] = useState(null);
    const [isSubmitted, setSubmitted] = useState(false);

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
                        <button className='new-doc-button' type="submit" onclick={handleRegister}>Register</button>
                    </div>
                </div>
            )}
        </div>
    );
}
