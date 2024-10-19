// src/pages/register.js

import React, { useEffect, useState } from 'react';
// import { useHistory } from "react-router-dom";
// import { useRouter } from 'next/router';
// import RedirectComp from '@/components/RedirectDocId';

// import { useParams } from 'react-router-dom';

export default function Register() {
    // let history = useHistory();
    // // const router = useRouter();
    const [newUser, setNewUser] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [isSubmitted, setSubmitted] = useState(false);

    const handleNewRegister = async (e) => {
        e.preventDefault();

        setSubmitted(true);

        // compare the two passwords before the register......

        const loginData = {
            email: user,
            password: password
        };


        try {
            const response = await fetch('http://localhost:1337/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error, status ${response.status}`);
            }
            
            // fix what will happen after register ....  test
        } catch (err) {
            console.error("Fetch error:", err)
        }
    }


    return (
        <div className='login'>
            <h1>Login</h1>
            {newToken ? (
                <RedirectComp route={"/login"} />
            ) : (
                <div>
                    <div className='login-form'>
                        <form onSubmit={handleNewRegister}>
                            <div>
                            <label>Username: </label>
                            <input className='textarea'
                                    type="text"
                                    value={newUser}
                                    placeholder='email/username'
                                    onChange={(e) => setNewUser(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                            <label>Password: </label>
                            <input className='textarea'
                                    type="text"
                                    value={newPassword}
                                    placeholder='******'
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                            <label>Confirm Password: </label>
                            <input className='textarea'
                                    type="text"
                                    value={newPassword2}
                                    placeholder='******'
                                    onChange={(e) => setNewPassword2(e.target.value)}
                                    required
                                />
                            </div>
                            <button className='new-doc-button' type="submit" disabled={isSubmitted}>register</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
