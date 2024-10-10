import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    myLocal: {
      url: "http://127.0.0.1:8545/",
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'] // it's a private key
    },
    // sepolia: {
    //   url: "https://sepolia.etherscan.io",
    //   accounts: ['PK'] // it's a private key
    // },
    // ethereum: {
    //   url: "",
    //   accounts: ['PK'] // it's a private key
    // },
  }
};

export default config;
