import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import DistributorPage from "./DistributorPage";
import ManufacturerPage from "./ManufacturerPage";
import OwnerPage from "./OwnerPage";
import RetailerPage from "./RetailerPage";
import Home from "./Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/owner" element={<OwnerPage />}></Route>
          <Route path="/manufacturer" element={<ManufacturerPage />}></Route>
          <Route path="/distributor" element={<DistributorPage />}></Route>
          <Route path="/retailer" element={<RetailerPage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
