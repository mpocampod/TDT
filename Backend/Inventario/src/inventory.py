from concurrent import futures
import grpc

import server_pb2
import server_pb2_grpc

class InventoryServicer(server_pb2_grpc.InventoryServiceServicer):

    def __init__(self):
        self.products = []
        self.quantities = []

    def GetProducts(self, request, context):
        # Retorna el catálogo actual de productos y cantidades
        productList = server_pb2.ProductList()
        for product, quantity in zip(self.products, self.quantities):
            productList.products.add(product_name=product, quantity=quantity)
        return productList

    def AddProducts(self, request, context):
        # Agrega los productos y cantidades recibidos en el mensaje a los arrays del inventario
        for product in request.products:
            self.products.append(product.product_name)
            self.quantities.append(product.quantity)
        # Envía el mensaje vacío de confirmación
        return server_pb2.Empty()
    
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    server_pb2_grpc.add_InventoryServiceServicer_to_server(InventoryServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Servidor inicializado en el puerto 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
