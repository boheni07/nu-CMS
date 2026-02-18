import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

function TestApp() {
    console.log('TestApp rendering with MainLayout...');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<div style={{ padding: 20 }}><h2>✅ Dashboard via TestApp</h2><p>MainLayout is working!</p></div>} />
                    <Route path="dashboard" element={<div style={{ padding: 20 }}><h2>Dashboard Page</h2></div>} />
                    <Route path="*" element={<div style={{ padding: 20 }}><h2>404 Not Found</h2></div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default TestApp;
