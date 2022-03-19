module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
      gas: 80000000,
    },
  },

  contracts_directory: "./contracts/",
  contracts_build_directory: "../src/contractBuilds/",
  compilers: {
    solc: {
      version: "0.8.11",
    },
  },
};
