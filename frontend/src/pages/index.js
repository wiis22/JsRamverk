// src/pages/Home.js

import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
// import { useParams } from 'react-router-dom';

export default function Home() {
    let history = useHistory();

    const [newTitle, setNewTitle] = useState('');
    const [docs, setDocs] = useState([]);

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
            // return redirect(`/doc/${newDocId}`);

            history.push(`/doc/${newDocId}`) // denna redirect fungerar ej. problemet är att history får tyldigen inte skapas pga att det inte verkar vara inuti en routing ellet nåt. har testat flera andra redirects. den gamla var inte SPA.
        } catch (err) {
            console.error("Fetch error:", err)
        }
    }


    return (
        <div className='home'>
            <div className='docs-list'>
                <h2>Dokument</h2>
                    {docs.length === 0 ? (
                        <p>Det finns inga dokument, skapa ett?</p>
                    ) : (
                        docs.map((doc) => (
                            <div className='doc-in-list' key={doc._id}>
                                <a href={`/doc/${doc._id}`}>{doc.title} - {doc._id}</a>
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
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                    </label>
                    <button type="submit">Skapa dokument</button>
                </form>
            </div>
        </div>
    );
}
