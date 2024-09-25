// src/components/Layout.js

import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header.js";
import Footer from "./Footer.js";

function Layout({ children }) {
    return (
        <html>
            <Header>

            </Header>

            <main>
                {children}
            </main>

            <Footer>
                
            </Footer>
        </html>
    );
}

export default Layout;
