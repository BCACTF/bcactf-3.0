import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from "./Home";
import LogIn from './LogIn';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/log-in" element={<LogIn/>}/>
            {/* <Route path="/sign-up" element={<SignUp/>}/> */}
        </Routes>
    );
}

export default App;
