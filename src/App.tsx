import React from 'react';
import { NavLink, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import IndexPage from './pages/IndexPage';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
