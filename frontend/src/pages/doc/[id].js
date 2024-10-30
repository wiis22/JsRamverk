// src/pages/{id}.js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io } from "socket.io-client";

const SERVER_URL = "https://wiis22.azurewebsites.net";

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
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentPosition, setCommentPosition] = useState({ start: 0, end: 0 });

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

                // Get the comments
                const commentResp = await fetch(`https://wiis22.azurewebsites.net/api/comments/${id}`);
                const commentRes = await commentResp.json();
                // console.log("commentRes:", commentRes);

                setComments(commentRes);


            } catch (error) {
                console.error("Error fetching document:", error.message);
            }
        };

        fetchDocument();

        // setup socket connection
        socket = io(SERVER_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"]
        });

        socket.on("doc", (data) => {
            setTitle(data.title);
            setContent(data.content);
        });

        socket.emit("create", id);

        socket.on("comment", (comment) => {
            // console.log("comment:", comment)
            if (comment.removed) {
                setComments((prevComments) => prevComments.filter((_, i) => i !== comment.index));
            } else {
                setComments((prevComments) => [...prevComments, comment.commentData]);
            }
        });

        // disconnect socket
        return () => {
            socket.disconnect();
        };

    }, [id]);


    const handleAddComment = () => {
        // console.log("inne i handleAddComment");
        // console.log("newComment:", newComment );
        // console.log("comPos start:", commentPosition.start);
        
        // console.log("comPos end:", commentPosition.end);

        //den kommer inte förbi denna skit.
        if (newComment === "" || commentPosition.start === commentPosition.end) {
            console.log("inne i if");
            return
        };

        const commentData = {
            docId: id,
            textCommented: content.substring(commentPosition.start, commentPosition.end),
            commentText: newComment
        }
//         console.log("commentData:", commentData);


        socket.emit("comment", commentData);
        setNewComment('');
    };

    const handleTextSelect = (e) => {
        const start = e.target.selectionStart;

        const end = e.target.selectionEnd;

        // console.log("text selected pos start, end :", start, end);

        setCommentPosition({ start, end });
    }

    const handleCharUpdate = async (valueToUpdate, value) => {
        let updatedTitle = title;
        let updatedContent = content;
        if (valueToUpdate === "title") {
            setTitle(value);
            updatedTitle = value;
        } else if (valueToUpdate === "content") {
            setContent(value);
            updatedContent = value;
        }

        const data = {
            id: id,
            title: updatedTitle,
            content: updatedContent
        }

        socket.emit("doc", data);
    };

    const handleSave = async (e) => {
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

        // console.log("data", data)

        const response = await fetch('https://wiis22.azurewebsites.net/api/share-doc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // console.log("response", response)
        const res = await response.json();
    }

    const handleStartSharing = async (e) => {
        e.preventDefault();

        // console.log("started sharing")

        // make share document form not hidden
        setShareFormHidden(false);

        // make start sharing button hidden
        setShareButtonHidden(true);
    }

    const handleRemoveComment = async (commentId, index) => {
        const data = {
            docId: id,
            commentId: commentId,
            index: index
        };

        socket.emit("comment", data, true);
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

            <div className='doc-container'>
                <div className='doc-left-col'>
                    <form onSubmit={handleSave} className='new-doc'>
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
                                onSelect={handleTextSelect}
                            />
                        <button className="button" type="submit">Save</button>
                    </form>
                </div>

                <div className='comments-container doc-right-col'>
                    <div className='comments'>
                        <h3>Comments</h3>
                        <ul>
                            {comments.map((comment, index) => (
                                <li
                                    key={index}
                                    className='comment'
                                >
                                    <strong>Comment for: &quot;{comment.textCommented}&quot;</strong>
                                    <p>{comment.commentText}</p>

                                    <button
                                        className='remove-comment-button button'
                                        onClick={() => handleRemoveComment(comment._id, index)}
                                    >
                                        Remove comment
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='add-comment'>
                        <h4>Add a commment</h4>
                        <p>Remember to select what part you would like to comment.</p>
                        <textarea className='comments-textarea textarea'
                            value={newComment}
                            maxLength={200}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Write your comment here.'
                        />
                        <button className='button' onClick={handleAddComment}>Add comment</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
