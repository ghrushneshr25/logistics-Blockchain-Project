import React, { useEffect } from "react";
import "./App.css";
import ReceiveProductDistributorComponent from "./Distributor/ReceiveProductDistributorComponent";
import GetProductDetails from "./GetProductDetails";

export default () => {
  return (
    <>
      <ReceiveProductDistributorComponent />
      <GetProductDetails />
    </>
  );
};
