// Home.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Home() {

    const [newTitle, setNewTitle] = useState('');
    const [docs, setDocs] = useState('');

    useEffect(() => {
        const fetchDocs = async () => {
            const response = await fetch('http://localhost:3001/api/get-all-docs');
            const result = await response.json();
            setDocs(result);
        };

        fetchDocs();
    }, []);

    const handleNewDocSubmit = async (e) => {
        e.preventDefault();

        const data = {
            title
        };

        const response = await fetch('http://localhost:3001/api/new-doc', { // använder inte response nu men kan vara bra att göra en try catch
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // här ska det in en redirect till routen /doc/{id}. id ska vara 'response' direkt ovan
    }


    return (
        <div className='home'>
            <div className='docs-list'>
                <h2>Dokument</h2>

                {docs.map((doc) => (
                    <div className='doc-in-list'>
                        <p className='doc-in-list-title'>{doc.title}</p>
                    </div>
                ))}
            </div>

            <div className='new-doc'>
                <form onSubmit={handleNewDocSubmit}>
                    <label>
                        Skapa nytt dokument:
                        <input type="text"
                            value={title}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                    </label>
                    <button type="submit">Skapa dokument</button>
                </form>
            </div>
        </div>
    );
}
