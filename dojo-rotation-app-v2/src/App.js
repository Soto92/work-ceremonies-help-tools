import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Admin } from "./components/admin";
import { Dojo } from "./components/dojo";

const App = () => (
  <Router>
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/dojo" element={<Dojo />} />
      <Route path="*" element={<Dojo />} />
    </Routes>
  </Router>
);

export default App;
