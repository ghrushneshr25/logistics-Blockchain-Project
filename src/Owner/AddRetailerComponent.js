import { addRetailer } from "../Web3Client";
import React, { useState } from "react";

export default () => {
  const [address, setaddress] = useState("");

  const submitValue = () => {
    addRetailer(address);
  };

  return (
    <>
      <h3>Add Retailer</h3>
      <input
        type="text"
        placeholder="Retailer Address"
        onChange={(e) => setaddress(e.target.value)}
      />
      <button onClick={submitValue}>Submit</button>
    </>
  );
};
