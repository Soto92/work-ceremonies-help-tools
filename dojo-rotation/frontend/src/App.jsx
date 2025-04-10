import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Leader from './components/leader';
import Participant from './components/participant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/leader" element={<Leader />} />
        <Route path="/dojo" element={<Participant />} />
        <Route path="*" element={<Participant />} />
      </Routes>
    </Router>
  );
}

export default App;
