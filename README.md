
# **Despliegue de servicios como un stack en Docker Swarm**
>
> En este repositorio se aborda de una manera sencilla el despiegue de 4 servicios a partir de un archivo **docker compose**.
>
> Los servicios definidos en el archivo **docker-stack-compose.yml** se ejecutaran y se gestionaran como parte de un stack en un entorno de Swarm.

## **Tecnologías utilizadas**

<div align="center" style="display: flex; justify-content: center; align-items: center;">
      <span style="margin-right: 20px;">
         <a href="https://nodejs.org/" target="_blank">
               <img width="100" title='Node.js' src='https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg'>
         </a>
      </span>
      <span style="margin-right: 20px;">
         <a href="https://es.javascript.info/" target="_blank">
               <img width="100" title='JavaScript' src='https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png'>
         </a>
      </span>
      <span style="margin-right: 20px;">
         <a href="https://www.docker.com/" target="_blank" title='Docker'>
               <img width="100" title='Docker' src='https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Docker_logo.svg/1920px-Docker_logo.svg.png'>
         </a>
      </span>
      </br>
</div>

## **Descripción del proyecto**

> En este proyecto se se aborda el despliegue de 4 servicios como parte de un **stack** que se ejecutan dentro del entorno de  **Docker Swarm**, este ultimo se encarga del balanceo.
>
> El **1er** servicio es una base de datos **MySQL** con una tabla llamada **personas**. A esta base de datos se conectaran dos servicios web uno con **SOAP** y una **REST API**.
>
> El **2do** servicio es una **REST API** básica que se conecta a la base de datos y permite **insertar un nuevo registro** a la tabla **personas**.
>
> El **3er** servicio es un **Web Service SOAP** simple que consulta todos los registros almacenados en la tabla **personas** de la base de datos.
>
> El **4to** servicio consume los dos "Web Service's" anteriores. Retorna una tabla html con los datos obtenidos y un formulario para insertar nuevos registros a la tabla.
>
> Cada unos de estos servicios se crean a partir de **imágenes Docker personalizadas** a partir de ficheros **Dockerfile** especificos.

## **Requerimientos**

* **Dokcer Desktop**
* El entorno **Nodejs**
* Clonar este repositorio

## Pasos a seguir para lograr de manera correcta el despliegue de los servicios

* Ejecutar la aplicacion Docker Desktop. Este paso es importante ya que es necesario tener iniciados los servicios de docker.

* Abrir un **CLI** dentro del directorio clonado, debe estar ubicado al mismo nivel del fichero **"docker-stack-compose.yml"**

1. **Inicializamos docker swarm con el siguiente comando**

      ```bash
        docker swarm init
      ```

2. **Ahora creamos las imagenes utilizando los ficheros Dockerfile específicos para cada servicio.**  No es necesario cambiarse a cada uno de los directorios para ejecutar los siguientes comandos.

   1. **Creamos primero la imagen de mysql a partir del fichero Dockerfile ubicado en el directorio imagenMysql**:

      ```bash
        docker build -t mysql:img ./mysql-img/
      ```

      * Ya esta especificado en el Dockerfile el script que crea la base de datos y la tabla 'personas'.

   2. **Luego creamos la imagen del Servicio Web SOAP con el siguiente comando**:

      ```bash
        docker build -t soap:ws ./soap-server/
      ```

   3. **Creamos la imagen de la REST API con el siguiente comando**:

      ```bash
        docker build -t rest:ws ./rest-server/
      ```

   4. **Creamos la imagen de la app desde la cual se consumiran los Servicio Web SOAP y REST, con el siguiente comando**:

      ```bash
        docker build -t cliente:web ./main-server/
      ```

   5. **Luego de crear cada una de estas imagenes especificada en el 'docker-stack-compose.yml' podemos continuar**

3. **Desplegamos los servicios como parte de un stack en un entorno de Swarm. Ejecuta el siguiente comando**

      ```bash
        docker stack deploy -c docker-stack-compose.yml app
      ```

   * Además de los servicios, también se crea (por defecto) una red interna, la cual se comparte entre todos estos servicios.

4. **Deberían haberse creado los servicios con 1 réplica cada uno, excepto el servicio cliente al que se especifico 4 réplicas**

5. **Puede verificar que los servicios se estan ejecutando correctamente usando el siguiente comando**

      ```bash
        docker service ls
      ```

6. **Pruebas**

    > Debería poder visualidar cada uno de los servicios desplegados.
    > Si todo está correcto, podría ver la tabla con los datos consultados, ademas del formulario para insertar nuevos registros**.
    >
    > Sólo debe abrir un navegador y ejecutar la siguiente direccion `http://localhost:3000`.

7. **Limpieza**

    * Luego de realizar las pruebas que crea necesarias, debe eliminar el Stack creado antes junto con los servicios desplegados dentro.
    * Ejecute el siguiente comando para eliminar el stack 'app' que se creo al momento de desplegar:

      ```bash
        docker stack rm app
      ```

    * Al eliminar el stack se eliminarán tambien la red que creo por defecto y los servicios que se estaban ejecutando dentro
    * Si necesita eliminar tambien las imagenes creadas en los primeros pasos solo ejecute el siguiente comando:

      ```bash
        docker rmi cliente:web rest:ws soap:ws mysql:img
      ```

    * Puede ejecutar los comandos a partir del paso 2 las veces que quiera y no deberia tener inconvenientes.
