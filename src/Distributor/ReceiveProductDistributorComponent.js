import React, { useState } from "react";
import { receiveProductByDistributor } from "../Web3Client";

export default () => {
  const [productId, setproductId] = useState("");
  const [productPrice, setproductPrice] = useState("");
  const submitValue = () => {
    receiveProductByDistributor(productId, productPrice);
  };

  return (
    <>
      <h3>Receive Product for Sale</h3>
      <input
        type="text"
        placeholder="Product ID"
        onChange={(e) => setproductId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Pay Price"
        onChange={(e) => setproductPrice(e.target.value)}
      />
      <button onClick={submitValue}>Submit</button>
    </>
  );
};
