import React, { useState } from "react";
import { shippedByManufacturer } from "../Web3Client";

export default () => {
  const [productId, setproductId] = useState("");
  const [shippedToAddress, setshippedToAddress] = useState("");
  const submitValue = () => {
    shippedByManufacturer(productId, shippedToAddress);
  };

  return (
    <>
      <h3>Ship Product</h3>
      <input
        type="text"
        placeholder="Product ID"
        onChange={(e) => setproductId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Address"
        onChange={(e) => setshippedToAddress(e.target.value)}
      />
      <button onClick={submitValue}>Submit</button>
    </>
  );
};
