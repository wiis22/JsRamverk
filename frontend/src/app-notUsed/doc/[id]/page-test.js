// src/doc/[id]/page.js
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// import { useParams } from 'react-router-dom';

export default function Doc() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch document data based on id
    useEffect(() => {
        const fetchDocument = async () => {
            // console.log(id);
            try {
                const response = await fetch(`http://localhost:4000/api/doc/${id}`);
                if (!response.ok) throw new Error('Blev fel vid hämtning av documentet.');

                const result = await response.json();
                // console.log(response);
                setTitle(result.title);
                setContent(result.content);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDocument();
        } else {
            setError('ID saknas!');
            setLoading(false);
        }
    }, [id]);


    const handleUpdate = async (e) => {
        e.preventDefault();

        const data = {
            id,
            title,
            content
        };
        try {

            const response = await fetch('http://localhost:4000/api/update', { // använder inte response nu men kan vara bra att göra en try catch
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Något gick fel vid uppdatering av dokumentet.')

            setSuccess(true);
        } catch (error) {
            setError(error.message);
        }

    }

    return (
        <div>
            {loading && <p>Laddar doku</p>}
            <form onSubmit={handleUpdate}>
                <label>
                    Title:
                    <input type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <label>
                    Content:
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </label>
                <button type="submit">Update</button>
            </form>
        </div>
    )
}
