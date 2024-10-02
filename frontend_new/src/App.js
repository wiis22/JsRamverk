import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';//finns ej
// import Layout from './components/Layout.js';
import Layout from './components/layout.js';
import Home from './pages/index.js';
import Id from './pages/doc/[id].js';

function App() {
    return (
        <Router>
            <Layout className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/doc/:id" element={<Id />} />
                    {/* Other routes */}
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
