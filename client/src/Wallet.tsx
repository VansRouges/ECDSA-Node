import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
import { toHex } from "ethereum-cryptography/utils"
import React, { useState } from 'react';

interface WalletProps {
  address: string;
  setAddress: (address: string) => void;
  balance: number;
  setBalance: (balance: number) => void;
  privateKey: string;
  setPrivateKey: (privateKey: string) => void;
}

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }: WalletProps) {
  async function onChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp.secp256k1.getPublicKey(privateKey))
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label style={{"margin": "10px 0;"}}>
        Private Key
        <input placeholder="Type a private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address.slice(0, 10)}...
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
