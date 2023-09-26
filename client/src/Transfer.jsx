import { useState } from "react";
import server from "./server";
import {secp256k1} from 'ethereum-cryptography/secp256k1'
import { keccak256 } from "ethereum-cryptography/keccak";

// Private Key: 9e85fc30e68d84d4235ea8a6bf8281ef3fbb25d535c4be7624a895ea9ea2e762
// Public Key: 03d82395f196d1ef9371900cb7e1ed3611c26b7f556777bb15a551edde75bbe450

// Private Key: 16ed6773513f937bb38a9068714c828067d4d0cd93fa687d88089692dd624522
// Public Key: 02f4460f93386e6ee04af04e6af848d8529e14dc38b16978c6b20d20b4ded01199

// Private Key: 7dab55495a37152797aec15e6fd40524c662b2e52d71f97b33c3247a41fd8116
// Public Key: 02ea896e5f84cf1cb5ebbc052b273e280b18281ecca5dafd065982efd2d065e386


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const hashMessage = message => keccak256(Uint8Array.from(message));
  const signMessage = msg => secp256k1.sign(hashMessage(msg),privateKey);

  async function transfer(evt) {
    evt.preventDefault();

    const msg = { amount: parseInt(sendAmount), recipient };
    const sig = signMessage(msg);

    const stringifyBigInts = obj =>{
      for(let prop in obj){
        let value = obj[prop];
        if(typeof value === 'bigint'){
          obj[prop] = value.toString();
        }else if(typeof value === 'object' && value !== null){
          obj[prop] = stringifyBigInts(value);
        }
      }
      return obj;
    }

    // stringify bigints before sending to server
    const sigStringed = stringifyBigInts(sig);
  
    const tx = {
      sig:sigStringed, msg, sender: address
    }

    try {
      const {
        data: { balance },
      } = await server.post(`send`, tx);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
