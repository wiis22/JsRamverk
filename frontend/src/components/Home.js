// Doc.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Home() {

    const [newTitle, setNewTitle] = useState('');



    const response = await fetch('http://localhost:3001/api/get-all', { // använder inte response nu men kan vara bra att göra en try catch
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });


    return (
        <div>

        test
            <form onSubmit={handleUpdate}>
                <label>
                    Skapa nytt dokument:
                    <input type="text"
                        value={title}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                </label>
                <button type="submit">Skapa</button>
            </form>
        </div>
    );
}
