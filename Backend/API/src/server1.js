const grpc = require('grpc');
const express = require('express');
const app = express();

const inventoryService = grpc.load('../protobufs/server.proto').inventory.InventoryService;
const inventoryClient = new inventoryService('localhost:50052', grpc.credentials.createInsecure());

app.post('/inventario', (req, res) => {
  const product_name = req.body.product_name;
  const quantity = req.body.quantity;
  inventoryClient.AddProduct({product_name: product_name, quantity: quantity}, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding product');
      return;
    }
    res.status(200).send(response);
  });
});

app.get('/inventario', (req, res) => {
  const product_name = req.params.product_name;
  inventoryClient.GetProduct({product_name: product_name}, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error getting product');
      return;
    }
    res.status(200).send(response);
  });
});

app.listen(8080, () => {
  console.log('API Gateway listening on port 8080');
});

app.post('/API/products', (req,res) => {
  pythonService.AddProduct({}, (err, response) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const products = response.products?.map(product => ({ product_name: AddProductRequest.product_name, quantity: product.quantity }));
      console.log(products);
      res.json(products);
    }
  });
});