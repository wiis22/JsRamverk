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
    const [user, setUser] = useState('');

    useEffect(() => {
        const verifyLoggedIn = async () => {
            const isLoggedIn = await loggedIn();
            console.log("isLoggedIn i home:", isLoggedIn);
            if (!isLoggedIn) {
                router.push("/login")
            }
        }
        verifyLoggedIn();
    }, []);

    useEffect(() => {
        const fetchDocs = async () => {
            setUser(sessionStorage.getItem('user'));
            console.log("fetching get-suer-docs with username " , user)
            const response = await fetch('http://localhost:1337/api/get-user-docs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const result = await response.json();
            setDocs(result);
        };

        fetchDocs();
    }, []);

    const handleNewDocSubmit = async (e) => {
        e.preventDefault();

        setSubmitted(true);
        const data = {
            title: newTitle,
            user: user
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
            setRouteNewDoc(`/doc/${newDocId}`);
            setNewDocId(newDocId);
            // history.push(`/doc/${newDocId}`) // denna redirect fungerar ej. problemet är att history får tyldigen inte skapas pga att det inte verkar vara inuti en routing ellet nåt. har testat flera andra redirects. den gamla var inte SPA.

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
