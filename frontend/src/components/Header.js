// src/components/Header.js

import React from "react";
// import { NavLink } from 'react-router-dom'
import Link from 'next/link';

export default function Header() {
    return (
        <header>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/AFUgGZPNT-k?si=9obOo3UyNmLAyf46" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

            {/* <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li> here is the fcuking problem fix this shit!
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav> */} 
        </header>


    )
}
