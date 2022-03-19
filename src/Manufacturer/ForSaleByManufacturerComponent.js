import React, { useState } from "react";
import { saleByManufacturer } from "../Web3Client";

export default () => {
  const [productId, setproductId] = useState("");
  const [productPrice, setproductPrice] = useState("");
  const submitValue = () => {
    saleByManufacturer(productId, productPrice);
  };

  return (
    <>
      <h3>Add Product to Sale</h3>
      <input
        type="text"
        placeholder="Product ID"
        onChange={(e) => setproductId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Price"
        onChange={(e) => setproductPrice(e.target.value)}
      />
      <button onClick={submitValue}>Submit</button>
    </>
  );
};
