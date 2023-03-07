
import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

dotenv.config()

const packageDefinition = protoLoader.loadSync(
  '../protobufs/server.proto', 
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
   });
  
const serverProto = grpc.loadPackageDefinition(packageDefinition).inventory;

const pythonService = new serverProto.InventoryService('localhost:50051', grpc.credentials.createInsecure());

const products = [];
const quantities = [];

function addProduct(call, callback) {
  const { product_name, quantity } = call.request;
  pythonService.addProduct({ product_name, quantity }, (err, response) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { success: true, message: response.message });
    }
  });
}

function getProducts(call, callback) {
  const productsList = products.map((product, i) => ({ product_name: product, quantity: quantities[i] }));
  callback(null, { products: productsList });
}

function main() {
  const server = new grpc.Server();
  server.addService(serverProto.InventoryService.service, { addProduct, getProducts });
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(),() => {
  server.start();
  console.log('Server started on port 50052');
  console.log(products[0]);
  console.log(quantities[0]);
  })
}

main();
