# TDT
# **Reto práctico**

**Curso:** Tópicos Especiales en Telemática <br>
**Título:** Comunicación entre Procesos Remotos: gRPC.<br>
**Objetivo:** Desarrollar habilidades en la comunicación entre procesos distribuidos utilizando llamadas a procedimientos remotos (RPCs), especificamente gRPC. Adicional a esto, conectarlos a un API gateway que facilite la comunicaión entre estos dos microserivicios.<br>
**Realizado por:** Paulina Ocampo Duque - Universidad Eafit

*******

**Tabla de Contenido**

1. [Introducción](#introduction)
2. [Recursos](#resources)
3. [Desarrollo](#development) 
4. [Resultados obtenidos](#resultados) <br>

*******

<div id='introduction'/> 

### **1. Introducción**

En este reto de programación lo que se buscaba hacer era implementar una aplicación de e-commerce pequeña con dos microservicios, en mi caso inventario y cátalogo que se pudieran comunicar entre sí a través de un API gateway y se recibiera peticiones de un cliente (postman). La lógica de negocio implementada para el inventario fue pedirle al postman que ingresara un arreglo de productos y su respectiva cantidad para almacenarlos en un array por medio de un POST y posteriormente cuando el postman quisiera visualizar los productos agregados, le pidiera al cátalogo por medio de un GET que le retornara el arreglo con los productos y cantidades.

*******

<div id='resources'/> 

### **2. Recursos**

Para el desarrollo de este reto se utilizaran dos lenguajes de programación: python para el inventario y node.js para el cátalogo y API gateway, adicional a esto realizaremos las pruebas en Postman.

*******

<div id='development'/>  

### **3. Desarrollo**

En las siguientes subsecciones se describen el conjunto de pasos que se requieren para el desarrollo del reto.

#### **3.1. Arquitectura a desplegar:**

A continuación, en la figura 1, se presenta la arquitectura que se va implementar en este reto. 

![arquitecturaReto drawio](https://user-images.githubusercontent.com/68925248/223618258-59d4036c-5e61-4a4d-b2d9-78f4afc1b1ac.png)

El Postman genera un petición via HTTP al API para reenviarlas a los microservicios de acuerdo a lo que el cliente este pidiendo, el patrón utilizado fue el de microservicios, ya que estos se comportan de manera independiente y a su vez pueden compartir información sin afectarse entre ellos.
En el microservicio de inventario, el usuario agrega una serie de productos que ingresaron a su almacén con su respectiva cantidad para guardarlos en un arreglo, y luego enviarlos al segundo microservicio donde otro usuario o el mismo puedan visualizar que es lo que hay disponible en el cátalogo.
Para el API utilicé un framework llamado Exrpess, ya que este nos facilita la integración de tecnologias por su escalabilidad, velocidad y rendimiento.
La comunicación entre estos 3 servicios se dió a través de gRPC un framework de comunicación que gracias a su IDL (Protocol Buffers) nos permite hacer una serialización de los datos de una manera agnóstica al lenguaje de programación que se haya implementado. (es el que nos genera el .proto)


#### **3.2. Estructura del Proyecto:**

En este repositorio, va a encontrar la siguiente estructura para el proyecto:
* La carpeta "Backend" contiene la definición de cada una de las carpetas para cada servicio.
* Dos archivos .json que sirven como ejemplos para ejecutar los métodos en postman
* Un archivo README.md para documentar el reto y permitir que otros usuarios interactuen con él

#### **3.3. Librerias a importar:**

* **Para el caso de node.js:**

```sh
    npm install @grpc/grpc-js
    npm install @grpc/proto-loader
    npm install body-parser
    npm install express
    npm install grpc
    npm install grpc-tools
    npm install proto-loader
    npm install async
    npm install dotenv
    npm installprotobufs
    npm install --save express
    
```
 * **Para el caso de python :**

```sh
  $ sudo python3 -m pip install grpcio
  $ sudo python3 -m pip install grpcio-tools
 ```

Para el caso de python, se necesita generar las interfaces a partir de la definición del archivo "server.proto" y a diferencia de node.js, esto no se hace en tiempo de ejecución. Para esto, se hace necesario estar en el directorio "src" de la carpeta "Inventario" y ejecutar el siguiente comando:

```sh
  $ sudo python3 -m grpc_tools.protoc -I ../protobufs --python_out=. --pyi_out=. --grpc_python_out=. ../protobufs/server.proto
```
#### **3.4. Ejecución de los servidores :**

 * **API gateway :**
```sh
 $ cd Backend
 $ cd API
 $ cd src
 $ sudo node index.js
 ```
  
  * **Catalogo :**
```sh
 $ cd Backend
 $ cd Catalogo
 $ cd src
 $ sudo node catalog.js
```

  * **Inventario :**
```sh
 $ cd Backend
 $ cd Inventario
 $ cd src
 $ sudo python3 inventory.py
```
<div id='resultados'/> 

#### **4 Resultados obtenidos:**

Para representar al cliente usamos Postman que nos permite simular un Browser que se conectara con el API a través del puerto 3000
Para el inventario le envie un POST con un .json formado por dos arreglos (product_name y quantity) que nos respondiera que lo ingresado fue añadido correctamente 

![Captura de Pantalla 2023-03-07 a la(s) 8 54 59 p  m](https://user-images.githubusercontent.com/68925248/223622902-d8137511-91b9-495a-83f8-ae1c8408afde.png)

Para el cátalogo lo que hice fue enviar GET con un .json vacio como petición, para que me retornara el arreglo que se habia guardado en el inventario
![Captura de Pantalla 2023-03-07 a la(s) 10 15 17 p  m](https://user-images.githubusercontent.com/68925248/223623179-2f1a2499-2495-4b56-afcb-3824153fdc57.png)


