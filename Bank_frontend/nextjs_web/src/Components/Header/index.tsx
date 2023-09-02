"use client";
import { Web3Button, useWeb3Modal } from "@web3modal/react";
import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const Header = () => {
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <div className="h-16 shadow-2xl bg-stone-500">
      <div className="flex items-center justify-end p-4">
        {/* <button onClick={() => connect()}>connectors</button> */}
        {/* {isConnected ? <div>{address}</div> : "Not Connected"} */}
        <Web3Button balance="show"></Web3Button>
      </div>
    </div>
  );
};

export default Header;
