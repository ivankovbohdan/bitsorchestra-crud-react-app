import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { AddEditBook } from "./pages/AddEditBook";
import { Layout } from "./pages/Layout";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-edit-book/:id?" element={<AddEditBook />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
