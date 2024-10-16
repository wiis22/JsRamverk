// src/pages/Home.js

import React, { useEffect, useState } from 'react';
// import { useHistory } from "react-router-dom";
// import { useRouter } from 'next/router';
// import RedirectComp from '@/components/RedirectDocId';

// import { useParams } from 'react-router-dom';

export default function Login() {
    // let history = useHistory();
    // // const router = useRouter();
    const [newTitle, setNewTitle] = useState('');
    const [docs, setDocs] = useState([]);
    const [newDocId, setNewDocId] = useState(null);
    const [isSubmitted, setSubmitted] = useState(false);

    const handleNewDocSubmit = async (e) => {
        e.preventDefault();

        setSubmitted(true);
        const data = {
            title: newTitle
        };
        try {
            const response = await fetch('https://wiis22.azurewebsites.net/api/new-doc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error, status ${response.status}`);
            }

            const newDocId = await response.json();

            console.log("redirecting to /doc/" + newDocId);
            // return redirect(`/doc/${newDocId}`);
            setNewDocId(newDocId);

        } catch (err) {
            console.error("Fetch error:", err)
        }
    }


    const handleRegister = async (e) => {
        e.preventDefault();
    }


    return (
        <div className='login'>
            <h1>login hejhej</h1>


            <div className='new-doc'>
                <form onSubmit={handleNewDocSubmit}>
                    <label>Skapa nytt dokument:</label>
                    <input className='textarea'
                            type="text"
                            value={newTitle}
                            placeholder='Titel'
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                        />
                    <button className='new-doc-button' type="submit" disabled={isSubmitted}>Login</button>
                </form>
            </div>
            <div>
                <button className='new-doc-button' type="submit" disabled={isSubmitted} onclick={handleRegister}>Register</button>
            </div>
        </div>
    );
}
