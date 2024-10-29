// src/pages/register.js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import RedirectComp from '@/components/RedirectDocId';

export default function Register() {
    const router = useRouter();
    const { email, id } = router.query;

    const [newUser, setNewUser] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [isSubmitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // if email is provided as a URL paramater, set it as the value of new user
    useEffect(() => {
        if (email) {
            setNewUser(email);
        }
    }, [email]);

    const handleNewRegister = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (newPassword !== newPassword2) {
            setErrorMessage("Password is not the same.")
            setSubmitted(false);

            setTimeout(() => {
                setErrorMessage("")
            }, 3000)
            return;
        }

        const newUserData = {
            email: newUser,
            password: newPassword
        };


        try {
            const registerResponse = await fetch('https://wiis22.azurewebsites.net/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUserData)
            });

            const data = await registerResponse.json();

            // console.log("data från api register:", data);

            if (!data.success) {
                throw new Error(data.message || "Registation failed");
            }

            const addUserData = {
                email: email,
                id: id
            };

            // if email exist, add user to document (got here via email link)
            if (email) {
                const addUserResponse = await fetch('https://wiis22.azurewebsites.net/api/doc-add-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(addUserData)
                });

                const addUserResult = await addUserResponse.json(); // not checking/using this currently
            }

            router.push("/login")

        } catch (err) {
            console.error("Fetch error:", err.message);
            // console.log("err.message inne i catch i register.js: ", err.message);
            
            if (err.message === "Username is already in use") {
                setErrorMessage("Email already exsits")
            } else {
                setErrorMessage(err.message);
            }

            setSubmitted(false);
            setTimeout(() => {
                setErrorMessage("")
            }, 3000);
            return;
        }
    }
 

    return (
        <div className='register'>
            <h1>Register</h1>
                <div>
                    <div className='login-form'>
                        <form onSubmit={handleNewRegister}>
                            <div>
                            <label>Email: </label>
                            <input className='textarea'
                                    type="text"
                                    value={newUser}
                                    placeholder='email'
                                    onChange={(e) => setNewUser(e.target.value)}
                                    readOnly={!!email}
                                    required
                                />
                            </div>

                            <div>
                            <label>Password: </label>
                            <input className='textarea'
                                    type="password"
                                    value={newPassword}
                                    placeholder='******'
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                            <label>Confirm Password: </label>
                            <input className='textarea'
                                    type="password"
                                    value={newPassword2}
                                    placeholder='******'
                                    onChange={(e) => setNewPassword2(e.target.value)}
                                    required
                                />
                            </div>

                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                            <button className='new-doc-button' type="submit" disabled={isSubmitted}>register</button>
                        </form>
                    </div>
                </div>
        </div>
    );
}
