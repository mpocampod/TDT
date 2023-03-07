import grpc

import inventory_pb2
import inventory_pb2_grpc

def run():
    channel = grpc.insecure_channel('localhost:3000')
    stub = inventory_pb2_grpc.InventoryServiceStub(channel)
    response = stub.AddProduct(inventory_pb2.AddProductRequest(product_name='Product 1', quantity=10))
    print("Product added:", response.success)

if __name__ == '__main__':
    run()
