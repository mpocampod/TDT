const express = require('express');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const packageDefinition = protoLoader.loadSync('../protobufs/server.proto');
const serverProto = grpc.loadPackageDefinition(packageDefinition).inventory;


const pythonService = new serverProto.InventoryService('localhost:50052', grpc.credentials.createInsecure());
const nodeService = new serverProto.InventoryService('localhost:50052', grpc.credentials.createInsecure());


app.post('/products', (req, res) => {
  const product_name = req.body.product_name;
  const quantity = req.body.quantity;
  pythonService.getProduct({}, (err, response) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const products = response.products.map(product => ({ product_name: product.product_name, quantity: product.quantity }));
    res.json(products);
  });
});

app.post('/add-product', (req, res) => {
  const productName = req.body.product_name;
  const quantity = req.body.quantity;

  nodeService.addProduct({ product_name: productName, quantity: quantity }, (err, response) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'Product added successfully' });
  });
});
app.listen(3000, () => {
  console.log('API Gateway listening on port 3000');
});
