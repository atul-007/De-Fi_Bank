const { network } = require("hardhat")
const { networkConfig, DevelopmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/Verify")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
   
    const args = []
    const fundMe = await deploy("Bank", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmation: network.config.blockConfirmation || 1,
    })
    if (
        !DevelopmentChains.includes(network.name) &&
        process.env.API_ETHER
    ) {
        await verify(fundMe.address, args)
    }
    log("---------------------------------")
}
module.exports.tags = ["all", "fundme"]
