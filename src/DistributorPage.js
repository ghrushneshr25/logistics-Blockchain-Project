import React, { useEffect, useRef } from "react";
import "./App.css";
import OwnedProductComponent from "./OwnedProductComponent";
import ShippedProductComponent from "./ShippedProductComponent";
import Web3 from "web3";
import SupplyChain from "./contractBuilds/SupplyChain.json";
import { OWNERADDRESS, CONTRACTADDRESS } from "./constants";
import { useState } from "react";
const web3_utils = require("web3-utils");

export default () => {
  const [accountAddress, setAccountAddress] = useState();
  const [ownedProducts, setOwnedProducts] = useState();
  const [shippedProducts, setShippedProducts] = useState([]);
  const [supplyChainContract, setContract] = useState();

  let web3;

  const init = async () => {
    let provider = window.ethereum;
    if (typeof provider !== "undefined") {
      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccountAddress(accounts[0]);
        })
        .catch((error) => {});

      window.ethereum.on("accountsChanged", function(accounts) {
        setAccountAddress(accounts[0]);
      });
    }
    web3 = new Web3(provider);
    setContract(new web3.eth.Contract(SupplyChain.abi, CONTRACTADDRESS));
  };

  const getEntityOfUser = async (check) => {
    let r = await supplyChainContract.methods.getEntity().call({
      from: check,
      gas: 80000000,
    });
    if (r == 5 && check === OWNERADDRESS) {
      r = 0;
    }
  };

  const fetchOwnedProducts = async () => {
    let output = await supplyChainContract.methods
      .getOwnedProducts(accountAddress)
      .call({ from: accountAddress, gas: 80000000 });
    setOwnedProducts(output);
  };

  const fetchShippedProducts = async () => {
    let output = await supplyChainContract.methods
      .getShippedProducts(accountAddress)
      .call({ from: accountAddress, gas: 80000000 });
    setShippedProducts(output);
  };

  const receiveProductByDistributor = async (productId, productPrice) => {
    let transaction = await supplyChainContract.methods
      .receivedbydistributor(productId)
      .send({
        from: accountAddress,
        value: web3_utils.toWei(productPrice.toString()),
      })
      .catch((error) => {
        console.log(error);
      });

    return transaction;
  };

  const ReceiveProductDistributorComponent = () => {
    const [productId, setproductId] = useState("");
    const [productPrice, setproductPrice] = useState("");

    const submitValue = async () => {
      let output = await receiveProductByDistributor(productId, productPrice);

      if (output !== undefined) {
        alert("transaction successful" + JSON.stringify(output));
      } else {
        alert("transaction unsuccessful");
      }
    };

    return (
      <>
        <h3>Receive Product</h3>
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

  const ForSaleByDistributorComponent = () => {
    const [productId, setproductId] = useState("");
    const [productPrice, setproductPrice] = useState("");
    const submitValue = async () => {
      let output = await saleByDistributor(productId, productPrice);

      if (output) {
        alert("Product Added for Sale");
      } else {
        alert("Transaction Failed, check authentication once");
      }
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

  const saleByDistributor = async (productId, price) => {
    let transactionStatus = false;
    await supplyChainContract.methods
      .forsalebydistributor(productId, web3_utils.toWei(price.toString()))
      .send({ from: accountAddress })
      .then((transaction) => {
        transactionStatus = true;
      })
      .catch((error) => {
        console.log(error);
      });

    return transactionStatus;
  };

  const shippedByDistributor = async (productId, shippedToAddress) => {
    let transactionStatus = false;
    await supplyChainContract.methods
      .shippedbydistributor(productId, shippedToAddress)
      .send({ from: accountAddress })
      .then((transaction) => {
        transactionStatus = true;
      })
      .catch((error) => {
        console.log(error);
      });
    return transactionStatus;
  };

  const ShippedByDistributorComponent = () => {
    const [productId, setproductId] = useState("");
    const [shippedToAddress, setshippedToAddress] = useState("");
    const submitValue = async () => {
      let output = await shippedByDistributor(productId, shippedToAddress);
      if (output) {
        alert("Product Added for Sale");
      } else {
        alert("Transaction Failed, check authentication once");
      }
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

  const handleOwnedClick = () => {
    fetchOwnedProducts();
    setShippedDisplay(false);
    setOwnedDisplay(true);
  };
  const [ownedDisplay, setOwnedDisplay] = useState(false);
  useEffect(() => {
    init();
  }, []);

  const handleShippedClick = () => {
    fetchShippedProducts();
    setOwnedDisplay(false);
    setShippedDisplay(true);
  };
  const [shippedDisplay, setShippedDisplay] = useState(false);

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <p>{accountAddress}</p>
      <ReceiveProductDistributorComponent />
      <ForSaleByDistributorComponent />
      <ShippedByDistributorComponent />
      <button onClick={handleOwnedClick}>Owned Products</button>
      <button onClick={handleShippedClick}>Shipped Products</button>
      {ownedProducts && ownedDisplay ? (
        <OwnedProductComponent owned={ownedProducts} />
      ) : (
        ""
      )}
      {shippedProducts && shippedDisplay ? (
        <ShippedProductComponent shipped={shippedProducts} />
      ) : (
        ""
      )}
    </>
  );
};
