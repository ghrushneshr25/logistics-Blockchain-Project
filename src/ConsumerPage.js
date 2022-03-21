import React, { useEffect, useRef } from "react";
import "./App.css";
import OwnedProductComponent from "./OwnedProductComponent";
import ShippedProductComponent from "./ShippedProductComponent";
import Web3 from "web3";
import SupplyChain from "./contractBuilds/SupplyChain.json";
import { OWNERADDRESS, CONTRACTADDRESS } from "./constants";
import ProductDetailsComponent from "./ProductDetailsComponent";

import { useState } from "react";
const web3_utils = require("web3-utils");

export default () => {
  const [accountAddress, setAccountAddress] = useState();
  const [ownedProducts, setOwnedProducts] = useState();
  const [shippedProducts, setShippedProducts] = useState([]);
  const [supplyChainContract, setContract] = useState();
  const [displayDetails, setDisplayDetails] = useState(false);
  const [productDetails, setProductDetails] = useState();
  const [shippedDisplay, setShippedDisplay] = useState(false);
  const [ownedDisplay, setOwnedDisplay] = useState(false);
  const [productId, setproductId] = useState("");
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

  const receiveProductByConsumer = async (productId, productPrice) => {
    let transaction = await supplyChainContract.methods
      .receivedbycustomer(productId)
      .send({
        from: accountAddress,
        value: web3_utils.toWei(productPrice.toString()),
      })
      .catch((error) => {
        console.log(error);
      });

    return transaction;
  };

  const ReceiveProductConsumerComponent = () => {
    const [productId, setproductId] = useState("");
    const [productPrice, setproductPrice] = useState("");

    const submitValue = async () => {
      let output = await receiveProductByConsumer(productId, productPrice);

      if (output !== undefined) {
        alert("transaction successful" + JSON.stringify(output));
      } else {
        alert("transaction unsuccessful");
      }
    };

    return (
      <>
        <h3>Receive Product from Retailer</h3>
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

  const CollectibleForSaleByCustomerComponent = () => {
    const [productId, setproductId] = useState("");
    const [productPrice, setproductPrice] = useState("");
    const submitValue = async () => {
      let output = await collectibleForSaleByCustomer(productId, productPrice);

      if (output) {
        alert("Product Added for Sale");
      } else {
        alert("Transaction Failed, check authentication once");
      }
    };

    return (
      <>
        <h3>Collectible for Sale</h3>
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

  const collectibleForSaleByCustomer = async (productId, price) => {
    let transactionStatus = false;
    await supplyChainContract.methods
      .collectibleforsalebycustomer(
        productId,
        web3_utils.toWei(price.toString())
      )
      .send({ from: accountAddress })
      .then((transaction) => {
        transactionStatus = true;
      })
      .catch((error) => {
        console.log(error);
      });

    return transactionStatus;
  };

  const shippedCollectibleByCustomer = async (productId, shippedToAddress) => {
    let transactionStatus = false;
    await supplyChainContract.methods
      .shippedcollectiblebycustomer(productId, shippedToAddress)
      .send({ from: accountAddress })
      .then((transaction) => {
        transactionStatus = true;
      })
      .catch((error) => {
        console.log(error);
      });
    return transactionStatus;
  };

  const ShippedCollectibleByCustomerComponent = () => {
    const [productId, setproductId] = useState("");
    const [shippedToAddress, setshippedToAddress] = useState("");
    const submitValue = async () => {
      let output = await shippedCollectibleByCustomer(
        productId,
        shippedToAddress
      );
      if (output) {
        alert("Product Added for Shipping");
      } else {
        alert("Transaction Failed, check authentication once");
      }
    };

    return (
      <>
        <h3>Ship Collectible</h3>
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

  const receivedCollectibleByCustomer = async (productId, productPrice) => {
    let transaction = await supplyChainContract.methods
      .receivedcollectiblebycustomer(productId)
      .send({
        from: accountAddress,
        value: web3_utils.toWei(productPrice.toString()),
      })
      .catch((error) => {
        console.log(error);
      });

    return transaction;
  };

  const ReceivedCollectibleByCustomerComponent = () => {
    const [productId, setproductId] = useState("");
    const [productPrice, setproductPrice] = useState("");

    const submitValue = async () => {
      let output = await receivedCollectibleByCustomer(productId, productPrice);

      if (output !== undefined) {
        alert("transaction successful" + JSON.stringify(output));
      } else {
        alert("transaction unsuccessful");
      }
    };

    return (
      <>
        <h3>Receive Collectible from Consumer</h3>
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

  const FindProductComponent = () => {
    const getProductDetails = async (productid) => {
      let productState = -1;
      let details = await supplyChainContract.methods
        .productDetail(productid)
        .call({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (details["uin"] == 0) {
        return undefined;
      }
      productState = details["productState"];

      let events = [];

      const e1 = await supplyChainContract.getPastEvents("allEvents", {
        filter: { uid: productid },
        fromBlock: 0,
        toBlock: "latest",
      });

      for (var j of e1) {
        if (j.returnValues.uin == productid) {
          events.push(j);
        }
      }

      return [details, events];
    };

    const submitValue = async () => {
      let fetched = await getProductDetails(productId);
      if (fetched === undefined) {
        alert("PRODUCT NOT FOUND");
        return;
      }
      setProductDetails(fetched);
      setOwnedDisplay(false);
      setShippedDisplay(false);
      setDisplayDetails(true);
    };

    return (
      <>
        <h3>Get Product Details</h3>
        <input
          type="text"
          placeholder="Product ID"
          onChange={(e) => setproductId(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </>
    );
  };

  const handleOwnedClick = () => {
    fetchOwnedProducts();
    setShippedDisplay(false);
    setDisplayDetails(false);
    setOwnedDisplay(true);
  };

  const handleShippedClick = () => {
    fetchShippedProducts();
    setOwnedDisplay(false);
    setDisplayDetails(false);
    setShippedDisplay(true);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <p>{accountAddress}</p>
      <ReceiveProductConsumerComponent />
      <CollectibleForSaleByCustomerComponent />
      <ShippedCollectibleByCustomerComponent />
      <ReceivedCollectibleByCustomerComponent />
      <FindProductComponent />
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
      {productDetails && displayDetails ? (
        <ProductDetailsComponent details={productDetails} />
      ) : (
        ""
      )}
    </>
  );
};
