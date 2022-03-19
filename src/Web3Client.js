import React from "react";
import Web3 from "web3";
import SupplyChain from "./contractBuilds/SupplyChain.json";
import { OWNERADDRESS, CONTRACTADDRESS } from "./constants";
import { useState } from "react";
let selectedAccount;
let supplyChainContract;
let typeOfUser;
let web3;
let ownedProducts;
let shippedProducts;

export const init = async () => {
  let provider = window.ethereum;
  if (typeof provider !== "undefined") {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log("Selected account: " + selectedAccount);
        getEntityOfUser(selectedAccount);
        getOwnedProducts(selectedAccount);
        getShippedProducts(selectedAccount);
      })
      .catch((error) => {
        console.log(error);
      });

    window.ethereum.on("accountsChanged", function(accounts) {
      selectedAccount = accounts[0];
      console.log("Selected account: " + selectedAccount);
      getEntityOfUser(selectedAccount);
      getOwnedProducts(selectedAccount);
      getShippedProducts(selectedAccount);
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
  typeOfUser = r;
  // console.log(typeOfUser);
};

const fetchOwnedProducts = async () => {
  console.log(selectedAccount);
  ownedProducts = await supplyChainContract.methods
    .x(selectedAccount)
    .call({ from: selectedAccount, gas: 80000000 });
  console.log(ownedProducts);
};

const fetchShippedProducts = async () => {
  shippedProducts = await supplyChainContract.methods
    .x(selectedAccount)
    .call({ from: selectedAccount, gas: 80000000 });
};

export const addManufacturer = (manufacturer) => {
  return supplyChainContract.methods
    .addManufacturer(manufacturer)
    .send({ from: selectedAccount })
    .then((transaction) => {
      console.log(transaction);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const addDistributor = (distributor) => {
  return supplyChainContract.methods
    .addDistributor(distributor)
    .send({ from: selectedAccount })
    .then((transaction) => {
      console.log(transaction);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const addRetailer = (retailer) => {
  return supplyChainContract.methods
    .addRetailer(retailer)
    .send({ from: selectedAccount })
    .then((transaction) => {
      console.log(transaction);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const addConsumer = (consumer) => {
  return supplyChainContract.methods
    .addConsumer(consumer)
    .send({ from: selectedAccount })
    .then((transaction) => {
      console.log(transaction);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const produceByManufacturer = async (
  productName,
  productDesc,
  productType,
  collectible,
  weight
) => {
  let transaction = await supplyChainContract.methods
    .producebymanufacturer(
      productName,
      productDesc,
      productType,
      collectible,
      weight
    )
    .send({ from: selectedAccount })
    .catch((error) => {
      console.log(error);
    });

  console.log(transaction.events.EProducedByManufacturer.returnValues[0]);
  return transaction.events.EProducedByManufacturer.returnValues[0];
};

export const saleByManufacturer = (productId, price) => {
  return supplyChainContract.methods
    .forsalebymanufacturer(
      productId,
      web3.utils.toWei(price.toString(), "ether")
    )
    .send({ from: selectedAccount })
    .then((transaction) => {
      console.log(transaction);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const shippedByManufacturer = (productId, shippedToAddress) => {
  return supplyChainContract.methods
    .shippedbymanufacturer(productId, shippedToAddress)
    .send({ from: selectedAccount })
    .then((transaction) => {
      console.log(transaction);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const receiveProductByDistributor = (productId, productPrice) => {
  return supplyChainContract.methods
    .receivedbydistributor(productId)
    .send({
      from: selectedAccount,
      value: web3.utils.toWei(productPrice.toString(), "ether"),
    })
    .then((transaction) => {
      console.log(transaction);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getProductDetails = async (productId) => {
  let productState = 0;
  let details = await supplyChainContract.methods
    .productDetail(productId)
    .call({ from: selectedAccount })
    .catch((error) => {
      console.log(error);
    });
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

  return { details: details, events: events };
};

export const getOwnedProducts = async (address) => {
  ownedProducts = await supplyChainContract.methods
    .getOwnedProducts(address)
    .call({ from: selectedAccount });
  // console.log(ownedProducts);
};

export const getShippedProducts = async (address) => {
  shippedProducts = await supplyChainContract.methods
    .getShippedProducts(address)
    .call({ from: selectedAccount })
    .catch((error) => {
      console.log(error);
    });
  // console.log(shippedProducts);
};
