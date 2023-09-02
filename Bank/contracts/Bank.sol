// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

error Bank__UpkeepNotNeeded(uint256 currentBalance, uint256 numborrowers);


contract Bank is  AutomationCompatibleInterface {
struct Borrower {
    uint256 amount;
    uint256 timestamp;
    uint256 collateral;
}

    mapping(address => uint256) public s_addressToAmountLended;
    mapping(address => Borrower) public s_addressToBorrower;
    address[] public s_lenders;
    address[] public s_borrowers;
uint256 private s_lastTimeStamp;
    // Could we make this constant?  /* hint: no! We should make it immutable! */
    uint256 private immutable i_interval;
    uint256 private immutable i_interest_rate;
    uint256 public constant MINIMUM_USD = 0.005 * 10 ** 18;

    event InterestAppliedOnBorrowedMoney(address indexed borrowerAddress, uint256 indexed newAmount);

 

    constructor() {
        i_interest_rate = 1;
        i_interval=100000000000;
        s_lastTimeStamp =block.timestamp;
    }

    function Lend() public payable {
        require(
            msg.value >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountLended[msg.sender] += msg.value;
        s_lenders.push(msg.sender);
    }


    function Collateral(uint256 collateral) public {
        require(collateral>0,"collateral needed");
        s_addressToBorrower[msg.sender].collateral = collateral;
        if(s_addressToBorrower[msg.sender].timestamp==0){
        s_addressToBorrower[msg.sender].timestamp = block.timestamp;
        }
    }
    
    function Repayment() public payable {
        bool borroweExists = false;
              for (uint i = 0; i < s_borrowers.length; i++) {
        if (s_borrowers[i] == msg.sender) {
            borroweExists =  true;
        }
    }

    
        require(borroweExists,"You dont have anything to Repay");
        require(s_addressToBorrower[msg.sender].amount!=0,"You dont have anything to Repay");
        require(s_addressToBorrower[msg.sender].amount>=msg.value);
        s_addressToBorrower[msg.sender].amount=s_addressToBorrower[msg.sender].amount - msg.value;
            for (uint i = 0; i < s_borrowers.length; i++) {
        if (s_borrowers[i] == msg.sender) {
            delete s_borrowers[i];
        }}

    }


    function borrow(uint256 borrowAmount) public  {
        require(borrowAmount<address(this).balance,"Contract Dont have that much money right now!");
       require(borrowAmount+s_addressToBorrower[msg.sender].amount<((3*s_addressToBorrower[msg.sender].collateral)/2),"You need more collateral to borrow more");
        s_addressToBorrower[msg.sender].amount+=borrowAmount;
        s_borrowers.push(msg.sender);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: borrowAmount
        }("");
        if(!callSuccess){
            s_addressToBorrower[msg.sender].amount-=borrowAmount;
        }
        else{

        }
    }

    function withdraw() public {

        uint256 amount;
        for (
            uint256 lendersIndex = 0;
            lendersIndex < s_lenders.length;
            lendersIndex++
        ) {
            if(s_lenders[uint(lendersIndex)]==msg.sender){
                amount =s_addressToAmountLended[msg.sender];
                s_addressToAmountLended[msg.sender]=0;
                break;
            }
        }
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: amount
        }("");
        if(!callSuccess){
            s_addressToAmountLended[msg.sender] = amount;
        }
        else{

        amount = 0;
        }
        require(callSuccess, "Call failed");
    }

    // function CheaperWithdraw() public onlyOwner {
    //     address[] memory funders = s_lenders;
    //     for (
    //         uint256 funderIndex = 0;
    //         funderIndex < funders.length;
    //         funderIndex++
    //     ) {
    //         address funder = funders[funderIndex];
    //         s_addressToAmountLended[funder] = 0;
    //     }
    //     s_lenders = new address[](0);
    //     (bool callSuccess, ) = i_owner.call{value: address(this).balance}("");
    //     require(callSuccess, "Call failed");
    // }
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasBorrowers = s_borrowers.length > 0;
        upkeepNeeded = (timePassed && hasBorrowers);
        return (upkeepNeeded, "0x0"); // can we comment this out?
    }

    /**
     * @dev Once `checkUpkeep` is returning `true`, this function is called
     * and it kicks off a Chainlink VRF call to get a random winner.
     */
    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Bank__UpkeepNotNeeded(
                address(this).balance,
                s_borrowers.length
            );
        }
        for (uint i=0; i<s_borrowers.length; i++) {
    if (s_addressToBorrower[s_borrowers[uint(i)]].amount != 0 && (block.timestamp-s_addressToBorrower[s_borrowers[uint(i)]].timestamp)>(i_interval*365)) {
      s_addressToBorrower[s_borrowers[uint(i)]].amount += s_addressToBorrower[s_borrowers[uint(i)]].amount*i_interest_rate/100;


    emit InterestAppliedOnBorrowedMoney(s_borrowers[uint(i)],s_addressToBorrower[s_borrowers[uint(i)]].amount);
    }
  }
    }


    function getAddressToAmountLended(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountLended[funder];
    }

    function getLender(uint256 index) public view returns (address) {
        return s_lenders[index];
    }
    function getAddressToBorrower(
        address funder
    ) public view returns ( Borrower memory) {
        return s_addressToBorrower[funder];
    }

    function getBorrower(uint256 index) public view returns (address) {
        return s_borrowers[index];
    }
    function getInterval() public view returns (uint256){
        return i_interval;
    }

    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \
    //         yes  no
    //         /     \
    //    receive()?  fallback()
    //     /   \
    //   yes   no
    //  /        \
    //receive()  fallback()

    fallback() external payable {
    }

    receive() external payable {
    }
}

// Concepts we didn't cover yet (will cover in later sections)
// 1. Enum
// 2. Events
// 3. Try / Catch
// 4. Function Selector
// 5. abi.encode / decode
// 6. Hash with keccak256
// 7. Yul / Assembly
