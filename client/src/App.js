import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './pages/Test';
import Ranking from './pages/Ranking';
import EvaluationResult from './pages/EvaluationResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/evaluation" element={<EvaluationResult />} />
      </Routes>
    </Router>
  );
}

export default App;
