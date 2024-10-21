// src/pages/Home.js

import React, { useEffect, useState } from 'react';
// import { useHistory } from "react-router-dom";
import { useRouter } from 'next/router';
import loggedIn from '@/utils/checkLoggedIn';
import RedirectComp from '@/components/Redirect.js';

// import { useParams } from 'react-router-dom';

export default function Home() {
    const router = useRouter();
    // const [token, setToken] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [docs, setDocs] = useState([]);
    const [newDocId, setNewDocId] = useState(null);
    const [routeNewDoc, setRouteNewDoc] = useState('');
    const [isSubmitted, setSubmitted] = useState(false);
    const [loggedUser, setLoggedUser] = useState('');

    useEffect(() => {
        const verifyLoggedIn = async () => {
            const isLoggedIn = await loggedIn();
            // console.log("isLoggedIn i home:", isLoggedIn);
            if (!isLoggedIn) {
                router.push("/login")
            }
        }
        verifyLoggedIn();
    }, []);

    useEffect(() => {
        const fetchDocs = async () => {

            const userFromSession = sessionStorage.getItem('user');
            setLoggedUser(userFromSession);

            // const data = {
            //     user: user
            // }
            try{
                console.log("data after setuser: " , userFromSession);
                const response = await fetch('http://localhost:1337/api/get-user-docs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: userFromSession })
                });

                console.log("response i Home:", response);

                const result = await response.json();

                console.log("result i Home: ", result);
                setDocs(result);
            } catch (err) {
                console.error("error fetching the docs:", err);
            }

        };

        fetchDocs();
    }, []);

    const handleNewDocSubmit = async (e) => {
        e.preventDefault();

        setSubmitted(true);
        const data = {
            title: newTitle,
            user: loggedUser
        };
        console.log("data in handleNewDocSubmit:", data);
        
        try {
            const response = await fetch('http://localhost:1337/api/new-doc', {
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
            setRouteNewDoc(`/doc/${newDocId}`);
            setNewDocId(newDocId);

        } catch (err) {
            console.error("Fetch error:", err)
        }
    }


    return (
        <div className='home'>
            {newDocId ? (
                <RedirectComp route={routeNewDoc} />
            ) : (
                <div>
                    <div className='docs'>
                        <h2>Dokument</h2>
                            {docs.length === 0 ? (
                                <p>Det finns inga dokument, skapa ett?</p>
                            ) : (
                                docs.map((doc) => (
                                    <div className='single-doc' key={doc._id} onClick={() => {
                                        setRouteNewDoc(`/doc/${doc._id}`);
                                        setNewDocId(doc._id)
                                        }}>
                                        <a>{doc.title}</a>
                                    </div>
                                    ))
                            )}
                    </div>

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
                            <button className='new-doc-button' type="submit" disabled={isSubmitted}>Skapa dokument</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
