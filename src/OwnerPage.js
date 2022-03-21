import React, { useEffect, useRef } from "react";
import "./App.css";
import ProductDetailsComponent from "./ProductDetailsComponent";
import Web3 from "web3";
import SupplyChain from "./contractBuilds/SupplyChain.json";
import { CONTRACTADDRESS } from "./constants";
import { useState } from "react";

export default () => {
  const [accountAddress, setAccountAddress] = useState();
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

  const AddManufacturerComponent = () => {
    const [address, setAddress] = useState("");

    const submitValue = async () => {
      let output = await supplyChainContract.methods
        .addManufacturer(address)
        .send({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (output !== undefined) {
        alert("Manufacturer Added");
      } else {
        alert("Manufacturer Not Added");
      }
    };

    return (
      <>
        <h3>Add Manufacturer</h3>
        <input
          type="text"
          placeholder="Manufacturer Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </>
    );
  };

  const AddDistributorComponent = () => {
    const [address, setAddress] = useState("");

    const submitValue = async () => {
      let output = await supplyChainContract.methods
        .addDistributor(address)
        .send({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (output !== undefined) {
        alert("Distributor Added");
      } else {
        alert("Distributor Not Added");
      }
    };

    return (
      <>
        <h3>Add Distributor</h3>
        <input
          type="text"
          placeholder="Manufacturer Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </>
    );
  };

  const AddRetailerComponent = () => {
    const [address, setAddress] = useState("");

    const submitValue = async () => {
      let output = await supplyChainContract.methods
        .addRetailer(address)
        .send({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (output !== undefined) {
        alert("Retailer Added");
      } else {
        alert("Retailer Not Added");
      }
    };

    return (
      <>
        <h3>Add Retailer</h3>
        <input
          type="text"
          placeholder="Manufacturer Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </>
    );
  };

  const AddConsumerComponent = () => {
    const [address, setAddress] = useState("");

    const submitValue = async () => {
      let output = await supplyChainContract.methods
        .addConsumer(address)
        .send({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (output !== undefined) {
        alert("Consumer Added");
      } else {
        alert("Consumer Not Added");
      }
    };

    return (
      <>
        <h3>Add Consumer</h3>
        <input
          type="text"
          placeholder="Manufacturer Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={submitValue}>Submit</button>
      </>
    );
  };

  const FindProductComponent = () => {
    const [productId, setproductId] = useState("");
    const [displayDetails, setDisplayDetails] = useState(false);
    const [productDetails, setProductDetails] = useState();

    const getProductDetails = async (productId) => {
      let productState = -1;
      let details = await supplyChainContract.methods
        .productDetail(productId)
        .call({ from: accountAddress })
        .catch((error) => {
          console.log(error);
        });
      if (details["uin"] == 0) {
        return undefined;
      }
      productState = details["productState"];

      let events = [];
      let state = [
        "EProducedByManufacturer",
        "EForSaleByManufacturer",
        "EShippedByManufacturer",
        "EReceivedByDistributor",
        "EForSaleByDistributor",
        "EShippedByDistributor",
        "EReceivedByRetailer",
        "EForSaleByRetailer",
        "EShippedByRetailer",
        "EReceivedByCustomer",
        "ECollectibleForSaleByCustomer",
        "EShippedtheCollectibleByCustomer",
        "EReceivedCollectibleByCustomer",
      ];
      let i = 0;
      while (i <= productState) {
        const e1 = await supplyChainContract.getPastEvents(state[i], {
          filter: { uid: productId },
          fromBlock: 0,
          toBlock: "latest",
        });
        for (var j of e1) {
          events.push(j);
        }
        i++;
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
        {productDetails && displayDetails ? (
          <ProductDetailsComponent details={productDetails} />
        ) : (
          ""
        )}
      </>
    );
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <p>{accountAddress}</p>
      <AddManufacturerComponent />
      <AddDistributorComponent />
      <AddRetailerComponent />
      <AddConsumerComponent />
      <FindProductComponent />
    </>
  );
};
