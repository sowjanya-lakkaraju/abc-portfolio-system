import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionHistoryContainer from './components/transactionHistory/transactionHistoryContainer';
import './App.css';

/**
 * Main App Component
 * Root component that sets up routing and global app structure
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<TransactionHistoryContainer />} 
          />
          <Route 
            path="/transaction-history" 
            element={<TransactionHistoryContainer />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;