import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import Home from './pages/index.js';
import Doc from './pages/Doc.js';
import Id from './pages/doc/[id]test.js/index.js';

function App() {
    return (
        <Router>
            <Layout className="App">
                <Routes> 
                    <Route path="/" element={<Home />} />
                    <Route path="/:id" element={<Id />} />
                    <Route path="/doc/:id" element={<Doc />} />
                    {/* Other routes hello */}
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
