// src/app/layout.js

import React from "react";
import Header from "@/components/Header.js";
import Footer from "@/components/Footer.js";

// export const metadata = {
//     title: 'Home'
// }

export default function RootLayout({ 
    children,
 }) {
    return (
        <html lang="sv">
            <Header>
            </Header>
            <body>
                <main>
                    {children}
                </main>
            </body>
            <Footer>
            </Footer>
        </html>
    );
}
