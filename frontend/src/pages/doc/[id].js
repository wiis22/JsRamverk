// src/pages/{id}.js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:1337";

let socket;

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
            try {
                if (!id) {
                    throw new Error("No document ID provided.");
                }

                // fetch document from the API
                const response = await fetch(`https://wiis22.azurewebsites.net/api/doc/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch document data.");
                }
                const result = await response.json();

                setTitle(result.title);
                setContent(result.content);
                setUsers(result.users);


            } catch (error) {
                console.error("Error fetching document:", error.message);
            }
        };

        fetchDocument();

        // setup socker connection
        socket = io(SERVER_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"]
        });

        socket.emit("create", id);

        socket.on("doc", (data) => {
            setTitle(data.title);
            setContent(data.content);
        });

        // disconnect socket
        return () => {
            socket.disconnect();
        };

    }, [id]);


    const handleCharUpdate = async (valueToUpdate, value) => {
        if (valueToUpdate === "title") {
            setTitle(value);
        } else if (valueToUpdate === "content") {
            setContent(value);
        }

        const data = {
            id: id,
            title: title,
            content: content
        }

        socket.emit("doc", data);
    };

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
                            placeholder='email'
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
                        onChange={(e) => handleCharUpdate("title", e.target.value )}
                        required
                    />
                <label>Content:</label>
                <textarea className='doc-content textarea'
                        value={content}
                        onChange={(e) => handleCharUpdate("content", e.target.value)}
                    />
                <button className="button" type="submit">Save</button>
            </form>
        </div>
    )
}
