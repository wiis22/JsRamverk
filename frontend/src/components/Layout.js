// src/components/Layout.js
import React from "react";
import { Link } from "react-router-dom";

function Layout({ children }) {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>
            </header>
            <main>
                {children}
            </main>
            <footer>
                <p>Footer content goes here</p>
            </footer>
        </div>
    );
}

export default Layout;
