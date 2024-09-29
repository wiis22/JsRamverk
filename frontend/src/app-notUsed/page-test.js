// src/app/page.js
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import RedirectComp from '@/components/Redirect.js';
// import { useParams } from 'react-router-dom';

export default function Home() {
    const router = useRouter();
    const [newTitle, setNewTitle] = useState('');
    const [docs, setDocs] = useState([]);
    const [newDocId, setNewDocId] = useState(null);

    useEffect(() => {
        const fetchDocs = async () => {
            const response = await fetch('http://localhost:4000/api/get-all-docs');
            const result = await response.json();
            setDocs(result);
        };

        fetchDocs();
    }, []);

    const handleNewDocSubmit = async (e) => {
        e.preventDefault();

        const data = {
            title: newTitle
        };

        try {
            const response = await fetch('http://localhost:4000/api/new-doc', {
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

            setNewDocId(newDocId);
            router.push(`/doc/${newDocId}`);
        } catch (err) {
            console.error("Fetch error:", err)
        }
    }


    return (
        <div className='home'>
            {newDocId ? (
                <div>Throbbing .... </div>
            ) : (
                <div>
                    <div className='docs-list'>
                        <h2>Dokument</h2>
                            {docs.length === 0 ? (
                                <p>Det finns inga dokument, skapa ett?</p>
                            ) : (
                                docs.map((doc) => (
                                    <div className='doc-in-list' key={doc._id}>
                                        <a href={`/doc/${doc._id}`}>Title: {doc.title} - Doc ID: {doc._id}</a>
                                    </div>
                                    ))
                            )}
                    </div>

                    <div className='new-doc'>
                        <form onSubmit={handleNewDocSubmit}>
                            <label>
                                Skapa nytt dokument:
                                <input type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}//kan behövas ses över 'auth' of 'e' as it is undefined.
                                />
                            </label>
                            <button type="submit">Skapa dokument</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
