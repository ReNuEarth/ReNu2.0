
//Replace the contents of the hardhat.config.js file with the contents here.

require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');

const { RINKEBY_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 137
    },
    matic_testnet: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/ReFmyD8aau2mBy3zN-dt5bPIMrhuwDpK",
      accounts: [RINKEBY_PRIVATE_KEY] },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9d96a02b5bd14283badce2aa9d66d78a",
      accounts: [RINKEBY_PRIVATE_KEY] },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};