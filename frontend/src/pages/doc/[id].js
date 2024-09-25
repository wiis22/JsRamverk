// src/pages/Doc.js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { useParams } from 'react-router-dom';

export default function Doc() {
    const router = useRouter();
    const { id } = router.query
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Fetch document data based on id
    useEffect(() => {
        const fetchDocument = async () => {
            console.log(id);

            const response = await fetch(`http://localhost:4000/api/doc/${id}`); //bytte från '' till `` så id skickas korrekt
            const result = await response.json();
            console.log(response);

            setTitle(result.title);
            setContent(result.content);
        };

        fetchDocument();
    }, [id]); // the id part on this row is for if the id parameter in the URL changes, this runs again
        //behöver en try typ om inte id finns

    const handleUpdate = async (e) => {
        e.preventDefault();

        const data = {
            id,
            title,
            content
        };

        const response = await fetch('http://localhost:4000/api/update', { // använder inte response nu men kan vara bra att göra en try catch
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    // return (
    //     <div>
    //         <h1>{title}</h1>
    //         <p>{content}</p>
    //     </div>
    // )

    return (
        <div>
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
