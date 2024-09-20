// Doc.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Doc() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Fetch document data based on id
    useEffect(() => {
        const fetchDocument = async () => {
            const response = await fetch('http://localhost:3001/api/${id}');
            const result = await response.json();
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

        const response = await fetch('http://localhost:3001/api/update', { // använder inte response nu men kan vara bra att göra en try catch
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

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

export default Doc;
