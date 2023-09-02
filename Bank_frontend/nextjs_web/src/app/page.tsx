"use client";
import LendPage from "@/Components/Lend/Lend";
import Header from "@/Components/Header";
import WithdrawPage from "@/Components/Withdraw/Withdraw";
import { Web3Modal } from "@web3modal/react";
import react from "react";
import CollateralPage from "@/Components/Collateral/Collateral";
import BorrowPage from "@/Components/Borrow/Borrow";
import RepayPage from "@/Components/Repay/Repay";
export default function Home() {
  return (
    <div>
      <Web3Modal
        projectId={process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!}
      />
      <Header />

      <div className="py-8 space-y-2">
        <LendPage />
        <WithdrawPage />
        <CollateralPage />
        <BorrowPage />
        <RepayPage />
      </div>
    </div>
  );
}
