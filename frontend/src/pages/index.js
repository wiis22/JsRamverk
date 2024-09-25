// src/pages/Home.js

import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

export default function Home() {

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
            const response = await fetch('http://localhost:4000/api/new-doc', { // använder inte response nu men kan vara bra att göra en try catch
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error, status ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
            //redirect to rout /doc/{result} cuse you will get a id as response from new-doc if succes.
            window.location.href = `/doc/${result}`;
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
                                <a href={`/doc/${doc._id}`}>{doc.title}</a>
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
