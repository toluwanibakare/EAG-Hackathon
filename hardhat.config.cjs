require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY || "0x" + "0".repeat(64);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hskMainnet: {
      url: "https://mainnet.hsk.xyz",
      chainId: 177,
      accounts: DEPLOYER_KEY !== "0x" + "0".repeat(64) ? [DEPLOYER_KEY] : [],
    },
    hskTestnet: {
      url: "https://testnet.hsk.xyz",
      chainId: 133,
      accounts: DEPLOYER_KEY !== "0x" + "0".repeat(64) ? [DEPLOYER_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      hskMainnet: "unused",
      hskTestnet: "unused",
    },
    customChains: [
      {
        network: "hskMainnet",
        chainId: 177,
        urls: {
          apiURL: "https://hashkey.blockscout.com/api/v2",
          browserURL: "https://hashkey.blockscout.com",
        },
      },
      {
        network: "hskTestnet",
        chainId: 133,
        urls: {
          apiURL: "https://hashkey-testnet.blockscout.com/api/v2",
          browserURL: "https://hashkey-testnet.blockscout.com",
        },
      },
    ],
  },
};
