import { addDistributor } from "../Web3Client";
import React, { useState } from "react";

export default () => {
  const [address, setaddress] = useState("");
  const submitValue = () => {
    addDistributor(address);
  };

  return (
    <>
      <h3>Add Distributor</h3>
      <input
        type="text"
        placeholder="Distributor Address"
        onChange={(e) => setaddress(e.target.value)}
      />
      <button onClick={submitValue}>Submit</button>
    </>
  );
};
