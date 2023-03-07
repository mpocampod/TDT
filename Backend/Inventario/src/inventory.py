from concurrent import futures
import grpc

import inventory_pb2
import inventory_pb2_grpc

class InventoryServicer(inventory_pb2_grpc.InventoryServiceServicer):

    def __init__(self):
        self.products = []
        self.quantities = []

    def AddProduct(self, request, context):
        product_name = request.product_name
        quantity = request.quantity

        self.products.append(product_name)
        self.quantities.append(quantity)

        response = inventory_pb2.AddProductResponse(success=True, message="Product added to inventory")
        return response
    
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    inventory_pb2_grpc.add_InventoryServiceServicer_to_server(InventoryServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server started on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
