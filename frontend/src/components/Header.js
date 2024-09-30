// src/components/Header.js

import React from "react";
// import { NavLink } from 'react-router-dom'
import Link from 'next/link';
import { useRouter } from "next/router";

export default function Header() {
    const router = useRouter();
    return (
        <header>
            
                <p>Videon används för att hålla koll på att det håller sig till SPA, ta bort sen.</p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/AFUgGZPNT-k?si=9obOo3UyNmLAyf46" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                <div className='title-header' onClick={() => router.push("/")}>
                    <a><h1>React with nextjs SPA setup</h1></a>
                </div>
                <div className="nav">
                    <a className="nav-rout" onClick={() => router.push("/")}>Home</a>
                    <a className="nav-rout" onClick={() => router.push("/")}>Home</a>
                    <a className="nav-rout" onClick={() => router.push("/")}>Home</a>
                </div>
            
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
