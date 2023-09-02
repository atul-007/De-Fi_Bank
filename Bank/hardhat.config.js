require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")

const SEPOLIA_PRIVATE_KEY = process.env.PRIV
const ETHERSCAN_API_KEY = process.env.API_ETHER

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.6.6",
            },
            {
                version: "0.8.19",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
            accounts: [SEPOLIA_PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmation: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "INR",
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
}
