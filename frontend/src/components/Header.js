// src/components/Header.js

import React from "react";
import { useRouter } from "next/router";

export default function Header() {
    const router = useRouter();
    return (
        <header>
                <div className='title-header' onClick={() => router.push("/")}>
                    <a><h1>React with nextjs SPA setup</h1></a>
                </div>
                <div className="nav">
                    <a className="nav-rout" onClick={() => router.push("/")}>Home</a>
                    <a className="nav-rout" onClick={() => router.push("/login")}>Login</a>
                    {/* <a className="nav-rout" onClick={() => router.push("/")}>Home</a> */}
                </div>
        </header>
    )
}
