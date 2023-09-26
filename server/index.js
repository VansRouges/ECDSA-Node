const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02f95ccd69c1bbecd141b8375d2b6ae7d5e824b293088acfcc4080434637b40243": 100, //Temi
  "02f7d939f4aa4c60180053ba22248927778802a4b6c9a7127391fc748b3c2dbcd9": 50, // Ade
  "022b19eca6f27d724989d72cd38bed422be4fdab17aa90c3b3f3d0ebb172f09297": 75, // Ola
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
