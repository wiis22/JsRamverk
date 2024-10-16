// src/pages/{id}.js

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
            // console.log(id);

            const response = await fetch(`https://wiis22.azurewebsites.net/api/doc/${id}`);
            const result = await response.json();
            // console.log(response);

            setTitle(result.title);
            setContent(result.content);
        };

        if (id != undefined) {
            fetchDocument();
        }
    }, [id]); // the id part on this row is for if the id parameter in the URL changes, this runs again
        //behöver en try typ om inte id finns

    const handleUpdate = async (e) => {
        e.preventDefault();

        const data = {
            id,
            title,
            content
        };

        const response = await fetch('https://wiis22.azurewebsites.net/api/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    return (
        <div>
            <form onSubmit={handleUpdate} className='new-doc'>
                <label>Title:</label>
                <input className='doc-title textarea'
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                <label>Content:</label>
                <textarea className='doc-content textarea'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                <button className="button" type="submit">Update</button>
            </form>
        </div>
    )
}
