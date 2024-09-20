import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Home from './components/Home.js';
import Doc from './components/Doc.js';

function App() {
    return (
        <Router>
            <Layout className="App">
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/doc/:id" component={Doc} />
                    {/* Other routes hello */}
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;
