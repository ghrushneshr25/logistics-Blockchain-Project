import React, { useState } from "react";
import { produceByManufacturer } from "../Web3Client";

export default () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [collectible, setCollectible] = useState("");
  const [weight, setWeight] = useState("");

  const submitValue = () => {
    produceByManufacturer(
      productName,
      productDescription,
      productType,
      collectible,
      weight
    );
  };

  return (
    <>
      <h3>Add Product</h3>
      <input
        type="text"
        placeholder="Product Name"
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Description"
        onChange={(e) => setProductDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Type"
        onChange={(e) => setProductType(e.target.value)}
      />
      <input
        type="text"
        placeholder="Collectible True/False"
        onChange={(e) => setCollectible(e.target.value)}
      />
      <input
        type="text"
        placeholder="Weight"
        onChange={(e) => setWeight(e.target.value)}
      />
      <button onClick={submitValue}>Submit</button>
    </>
  );
};
