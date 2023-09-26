const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak.js")

const privateKey = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privateKey)

console.log("Private Key:", toHex(privateKey))
console.log("Public Key:", toHex(publicKey))
// console.log("Eth Address:", toHex(keccak256(publicKey.slice(1).slice(-20))))
