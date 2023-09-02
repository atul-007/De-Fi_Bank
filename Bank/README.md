# Bank 

This project demonstrates a basic Hardhat use case. It comes with a contract, a test for that contract, and a script that deploys that contract.

It has a very simmplistic UI using shadcnUi and tailwindcss made using next app(app router)


Create .env file first and create variables

PRIV=Your Sepolia account private key

API_ETHER=your etherscan api key for verification


Try running some of the following tasks:

```shell
npx hardhat deploy
npx hardhat test
npx hardhat node
```

This Contract is Deployed in Sepolia Network 

Contracts are verified by using verify script using etherscan api

User Manual:
Use wallet connect for connecting to web3 wallets

You can either lend or borrow money

For borrowing you have to first give some collateral 
You can borrow 1.5 times the collateral amount 
And for repayment you can either  partially repay or fully as per your convenience 
Interest rate is 1% per annum

You can also lend money 
Money lended can be withdrawed on clicking withdraw 
You can withdraw complete money that you have lended 

