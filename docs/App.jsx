import React from 'react';
import {MainPage, Navbar, Settings} from './MainPage';
// import Navbar from './components/Navbar';


const App = () => (
    <div className="app" style={{width: '100%', height: '100%'}} >
        <Navbar />
        {/* <Settings /> */}
        <MainPage />

    </div>
);

export default App;