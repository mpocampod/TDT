
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

function AddProducts(call, callback) {
  const { product_name, quantity } = call.request;
  pythonService.AddProducts({ product_name, quantity }, (err, response) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { success: true, message: response.message });
    }
  });
}

function GetProducts(callback) {
  pythonService.GetProducts({}, (err, response) => {
    if (err) {
      return callback(err);
    }
    const productList = response.productsList.map(product => ({
      product_name: product.productName,
      quantity: product.quantity,
    }));
    callback(null, productList);
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(serverProto.CatalogService.service, { AddProducts, GetProducts });
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(),() => {
  server.start();
  console.log('Server started on port 50052');
  })
}

main();
