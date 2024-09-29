// src/app/layout.js

import React from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";

// export const metadata = {
//     title: 'Home'
// }

export default function RootLayout({ 
    children
 }) {
    return (
            <div className="whole-page">
            <Header>
            </Header>
            
                <main>
                    {children}
                </main>
            
            <Footer>
            </Footer>
            </div>

        
    );
}
