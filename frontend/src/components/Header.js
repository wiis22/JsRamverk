// src/components/Header.js

import React from "react";
import { NavLink } from 'react-router-dom'

export default function Header() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>

            {/* det kanske ska göras på sättet nedan istället för ovan. Nedan ska vara för SPA, vet inte om ovan är det eller ej */}
            {/* <NavLink to="/new">Add Event</NavLink> */}

        </nav>
    )
}
