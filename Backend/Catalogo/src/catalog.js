
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

function GetProducts(call,callback) {

  pythonService.GetProducts({}, (err, response) => {

    if (err) {
      console.log("entra error(?)")
      console.error(err);
      return callback(err);
    }

    const productList = {
      products: response.products.map(product => ({
        product_name: product.product_name,
        quantity: product.quantity,
     }))
    };
     console.log(productList)
     callback(null, productList);
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(serverProto.CatalogService.service, { AddProducts, GetProducts });
  server.bindAsync('0.0.0.0:5000', grpc.ServerCredentials.createInsecure(),() => {
  server.start();
  console.log('Servidor inicializado en el puerto 5000');
  })
}

main();
