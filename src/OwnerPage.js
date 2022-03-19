import React, { useEffect } from "react";
import Web3 from "web3";
import SupplyChain from "./contractBuilds/SupplyChain.json";
import { OWNERADDRESS, CONTRACTADDRESS } from "./constants";
import { useState } from "react";
import "./App.css";

let selectedAccount;
let supplyChainContract;
let typeOfUser;
let web3;

const init = async () => {
  let provider = window.ethereum;
  if (typeof provider !== "undefined") {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log("Selected account: " + selectedAccount);
        typeOfUser = getEntityOfUser(selectedAccount);
      })
      .catch((error) => {
        console.log(error);
      });

    window.ethereum.on("accountsChanged", function(accounts) {
      selectedAccount = accounts[0];
      console.log("Selected account: " + selectedAccount);
      typeOfUser = getEntityOfUser(selectedAccount);
    });
  }

  web3 = new Web3(provider);

  supplyChainContract = new web3.eth.Contract(SupplyChain.abi, CONTRACTADDRESS);
};

const getEntityOfUser = async (check) => {
  let r = await supplyChainContract.methods.getEntity().call({
    from: check,
    gas: 80000000,
  });
  if (r == 5 && check === OWNERADDRESS) {
    r = 0;
  }
  return r;
};

const addManufacturer = async (manufacturer) => {
  let transactionStatus = false,
    transactionDetails = "failed";
  await supplyChainContract.methods
    .addManufacturer(manufacturer)
    .send({ from: selectedAccount })
    .then((transaction) => {
      transactionStatus = true;
      transactionDetails = transaction;
    })
    .catch((error) => {
      transactionStatus = false;
    });

  return [transactionStatus, transactionDetails];
};

const AddManufacturerComponent = () => {
  const [address, setaddress] = useState("");

  const submitValue = async () => {
    let i = await addManufacturer(address);
    if (i[0] === true)
      alert(
        "Manufacturer Added" + "\nTransaction Hash " + i[1].transactionHash
      );
    else alert("Failed Transaction");
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

const addDistributor = async (distributor) => {
  let transactionStatus = false,
    transactionDetails = "failed";
  await supplyChainContract.methods
    .addDistributor(distributor)
    .send({ from: selectedAccount })
    .then((transaction) => {
      transactionStatus = true;
      transactionDetails = transaction;
    })
    .catch((error) => {
      transactionStatus = false;
    });
  return [transactionStatus, transactionDetails];
};

const AddDistributorComponent = () => {
  const [address, setaddress] = useState("");
  const submitValue = async () => {
    let i = await addDistributor(address);
    if (i[0] === true)
      alert("Distributor Added" + "\nTransaction Hash " + i[1].transactionHash);
    else alert("Failed Transaction");
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

const addRetailer = async (retailer) => {
  let transactionStatus = false,
    transactionDetails = "failed";
  await supplyChainContract.methods
    .addRetailer(retailer)
    .send({ from: selectedAccount })
    .then((transaction) => {
      transactionStatus = true;
      transactionDetails = transaction;
    })
    .catch((error) => {
      transactionStatus = false;
    });
  return [transactionStatus, transactionDetails];
};

const AddRetailerComponent = () => {
  const [address, setaddress] = useState("");

  const submitValue = async () => {
    let i = await addRetailer(address);
    if (i[0] === true)
      alert("Retailer Added" + "\nTransaction Hash " + i[1].transactionHash);
    else alert("Failed Transaction");
  };

  return (
    <>
      <h3>Add Retailer</h3>
      <input
        type="text"
        placeholder="Retailer Address"
        onChange={(e) => setaddress(e.target.value)}
      />
      <button onClick={submitValue}>Submit</button>
    </>
  );
};

const addConsumer = async (consumer) => {
  let transactionStatus = false,
    transactionDetails = "failed";
  await supplyChainContract.methods
    .addConsumer(consumer)
    .send({ from: selectedAccount })
    .then((transaction) => {
      transactionStatus = true;
      transactionDetails = transaction;
    })
    .catch((error) => {
      transactionStatus = false;
    });
  return [transactionStatus, transactionDetails];
};

const AddConsumerComponent = () => {
  const [address, setaddress] = useState("");

  const submitValue = async () => {
    let i = await addConsumer(address);
    if (i[0] === true)
      alert("Retailer Added" + "\nTransaction Hash " + i[1].transactionHash);
    else alert("Failed Transaction");
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

export default () => {
  useEffect(() => {
    const initiate = async () => {
      await init();
      await sleep(1000);
    };
    initiate();

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    console.log(typeOfUser);
  });
  return (
    <>
      <AddManufacturerComponent />
      <AddDistributorComponent />
      <AddRetailerComponent />
      <AddConsumerComponent />
    </>
  );
};
