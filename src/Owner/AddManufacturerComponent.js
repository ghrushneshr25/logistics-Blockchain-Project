import { addManufacturer } from "../Web3Client";
import React, { useState } from "react";

export default () => {
  const [address, setaddress] = useState("");

  const submitValue = () => {
    addManufacturer(address);
  };

  return (
    <>
      <h3>Add Manufacturer</h3>
      <input
        type="text"
        placeholder="Manufacturer Address"
        onChange={(e) => setaddress(e.target.value)}
      />
      <button onClick={submitValue}>Submit</button>
    </>
  );
};
