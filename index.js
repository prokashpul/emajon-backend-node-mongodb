const express = require("express");
const cors = require("cors");

require("dotenv").config();

// create port
const port = process.env.PORT || 5000;
// create app
const app = express();
// middleware set
app.use(cors());
app.use(express.json());

//mongobd connect

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cdszt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("emaJon").collection("products");
    app.get("/product", async (req, res) => {
      const query = {};
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const cursor = productCollection.find(query);
      let products;
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send(products);
    });
    // count api
    // http://localhost:5000/productCount
    app.get("/productCount", async (req, res) => {
      const count = await productCollection.countDocuments();
      res.send({ count });
    });
  } finally {
  }
}
run().catch(console.dir);

//read data
app.get("/", (req, res) => {
  res.send("jon waiting for ema");
});

// listen
app.listen(port, () => {
  console.log("my port is running", port);
});
