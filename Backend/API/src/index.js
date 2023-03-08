const express = require('express');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const packageDefinition = protoLoader.loadSync('../protobufs/server.proto');
const serverProto = grpc.loadPackageDefinition(packageDefinition).inventory;


const pythonService = new serverProto.InventoryService('localhost:50051', grpc.credentials.createInsecure());
const nodeService = new serverProto.CatalogService('localhost:5000', grpc.credentials.createInsecure());

app.post('/add-product', (req, res) => {
  const products = req.body.product_name;
  const quantities = req.body.quantity;
  const productMessages = products.map((product, index) => {
    return { product_name: product , quantity: quantities[index] };
  });
  const productList = { products: productMessages };

  pythonService.AddProducts(productList, (err, response) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error' });
    }
    res.json({ message: 'Agregado correctamente' });
  });
});

app.get('/view-productsInv', (req, res) => {
  
  pythonService.GetProducts({},(err, response) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error' });
    }
    res.json(response);
  });
});

app.get('/view-productsCat', (req, res) => {
  
  nodeService.GetProducts({},(err, response) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error' });
    }
    res.json(response);
  });
});

app.listen(3000, () => {
  console.log('API gateway escuchando por el puerto 3000');
});

