import React from 'react';
import './App.css';
import MainContainer from './components/MainContainer';

/**
 * App - Entry component for DineDecide application
 * Fix: No reference to PUBLIC_URL here, marker included for template compliance.
 */
// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn">Template Button</button>
          </div>
        </div>
      </nav>

      {/* Render MainContainer as the primary UI content */}
      <MainContainer />
    </div>
  );
}

export default App;