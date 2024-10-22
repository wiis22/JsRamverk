// src/pages/{id}.js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { useParams } from 'react-router-dom';

export default function Doc() {
    const router = useRouter();
    const { id } = router.query
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [emailShareTo, setEmailShareTo] = useState('');
    const [shareFormHidden, setShareFormHidden] = useState(true);
    const [shareButtonHidden, setShareButtonHidden] = useState(false);
    const [users, setUsers] = useState([]);

    // Fetch document data based on id
    useEffect(() => {
        const fetchDocument = async () => {
            // console.log(id);

            const response = await fetch(`https://wiis22.azurewebsites.net/api/doc/${id}`);
            const result = await response.json();
            // console.log(response);

            setTitle(result.title);
            setContent(result.content);
            setUsers(result.users);
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
            content,
            users
        };

        const response = await fetch('https://wiis22.azurewebsites.net/api/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    const handleShareDocument = async (e) => {
        e.preventDefault();

        // make share document form hidden
        setShareFormHidden(true);

        // make start sharing button not hidden
        setShareButtonHidden(false);

        const data = {
            email: emailShareTo,
            id: id,
            title: title
        };

        console.log("data", data)

        const response = await fetch('http://localhost:1337/api/share-doc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log("response", response)
        const res = await response.json();
    }

    const handleStartSharing = async (e) => {
        e.preventDefault();

        console.log("started sharing")

        // make share document form not hidden
        setShareFormHidden(false);

        // make start sharing button hidden
        setShareButtonHidden(true);
    }


    return (
        <div>
            <div className="share-document">
                <button onClick={handleStartSharing} className="button start-sharing-button" hidden={shareButtonHidden}>Share</button>
                
                <form onSubmit={handleShareDocument} className="share-document-form" hidden={shareFormHidden}>
                    <label>Email</label>
                    <input className="share-email-input textarea"
                            type="text"
                            value={emailShareTo}
                            onChange={(e) => setEmailShareTo(e.target.value)}
                            required
                    />
                    <button className='button' type='submit'>Share</button>
                </form>
            </div>

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
