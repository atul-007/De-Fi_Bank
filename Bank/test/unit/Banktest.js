const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { DevelopmentChains } = require("../../helper-hardhat-config")
!DevelopmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.parseEther("1")
          let interval
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("Bank", deployer)
              interval = await fundMe.getInterval()
          })
          describe("constructor", async function () {
              it("initalise successfully", async function () {
                  const response = await fundMe.getAddress()
                  assert.isNotNull(response)
              })
          })
          describe("fund", async function () {
              it("It fails when not send enough eth", async function () {
                  await expect(fundMe.Lend()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })
              it("Updated the amount funded data structure", async function () {
                  await fundMe.Lend({ value: sendValue })
                  const response = await fundMe.getAddressToAmountLended(
                      deployer
                  )
                  assert.equal(parseInt(response), parseInt(sendValue))
              })
              it("Adds funder to Funders array", async function () {
                  await fundMe.Lend({ value: sendValue })
                  const response = await fundMe.getLender(0)
                  assert.equal(response, deployer)
              })
          })
          describe("Borrow", async function () {
              beforeEach(async function () {
                  await fundMe.Lend({ value: sendValue })
              })
              it("cant borrow more than bank ", async function () {
                  const startingFundMeBalance =
                      await fundMe.runner.provider.getBalance(
                          await fundMe.getAddress()
                      )
                  const startingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)
                  await expect(
                      fundMe.borrow(3000000000000000000n)
                  ).to.be.revertedWith(
                      "Contract Dont have that much money right now!"
                  )
              })
              it("cant borrow without collateral ", async function () {
                  const startingFundMeBalance =
                      await fundMe.runner.provider.getBalance(
                          await fundMe.getAddress()
                      )
                  const startingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)
                  // const collateraltransactionResponse = await fundMe.Collateral(
                  //     10
                  // )
                  // const collateraltransactionReceipt =
                  //     await collateraltransactionResponse.wait(1)
                  const collateral = await fundMe.getAddressToBorrower(deployer)
                  //   const borrow = await fundMe.borrow(30)
                  await expect(fundMe.borrow(30)).to.be.revertedWith(
                      "You need more collateral to borrow more"
                  )
              })
              it("Borrow eth more than collateral ", async function () {
                  const startingFundMeBalance =
                      await fundMe.runner.provider.getBalance(
                          await fundMe.getAddress()
                      )
                  const startingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)
                  const collateraltransactionResponse = await fundMe.Collateral(
                      10
                  )
                  const collateraltransactionReceipt =
                      await collateraltransactionResponse.wait(1)
                  const collateral = await fundMe.getAddressToBorrower(deployer)
                  await expect(fundMe.borrow(30)).to.be.revertedWith(
                      "You need more collateral to borrow more"
                  )
              })
          })
          describe("performUpkeep", function () {
              it("increases the amount with interest", async () => {
                  let borrower = await fundMe.connect(
                      (
                          await ethers.getSigners()
                      )[1]
                  )
                  const Lendtx = await fundMe.Lend({ value: sendValue })
                  await Lendtx.wait(1)
                  const Collateraltx = await borrower.Collateral(10000)
                  await Collateraltx.wait(1)
                  const Borrowtx = await borrower.borrow(1000)
                  await Borrowtx.wait(1)
                  await network.provider.send("evm_increaseTime", [
                      parseInt(interval) * 366,
                  ])
                  await network.provider.request({
                      method: "evm_mine",
                      params: [],
                  })
                  const tx = await fundMe.performUpkeep("0x")
                  await tx.wait(1)
                  const Borrower = await fundMe.getAddressToBorrower(
                      (
                          await ethers.getSigners()
                      )[1]
                  )
                  assert.equal(Borrower.amount, 1010)
              })
          })
      })
