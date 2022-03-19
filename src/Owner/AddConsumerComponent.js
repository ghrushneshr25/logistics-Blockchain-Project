import { addConsumer } from "../Web3Client";
import React, { useState } from "react";

export default () => {
  const [address, setaddress] = useState("");

  const submitValue = () => {
    addConsumer(address);
  };

  return (
    <>
      <h3>Add Consumer</h3>
      <input
        type="text"
        placeholder="Consumer Address"
        onChange={(e) => setaddress(e.target.value)}
      />
      <button onClick={submitValue}>Submit</button>
    </>
  );
};
