import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>SUPPLYCHAIN LOGISTICS MANAGEMENT BASED ON ETHEREUM</h1>
      <br />
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/owner">Owner</Link>
        </li>
        <li>
          <Link to="/manufacturer">Manufacturer</Link>
        </li>
        <li>
          <Link to="/distributor">Distributor</Link>
        </li>
        <li>
          <Link to="/retailer">Retailer</Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
