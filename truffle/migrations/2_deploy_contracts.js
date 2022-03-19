const SupplyChain = artifacts.require("SupplyChain");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(SupplyChain);
  const s = await SupplyChain.deployed();
};
