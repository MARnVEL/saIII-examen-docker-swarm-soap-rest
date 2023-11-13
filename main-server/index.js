
const express = require('express');
const soap = require('soap');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

let port = 3000;
let hostCliente = process.env.APP_CLIENTE_HOST || 'localhost';
let hostWebServSOAP = process.env.WEB_SERVICE_SOAP_HOST || 'localhost';

function displayResults(data) {
  data = data.reverse()
  let tabla = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Personas</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      <style>
          table {
            width: 80%;
            
          }
          th {
            border: 2px solid black;
            padding: 6px;
            text-align: center;
            font-size: 18px;
          }
          td {
              border: 2px solid black;
              padding: 6px;
              text-align: left;
              font-size: 16px;
          }
          h1, h3 {
            text-align: center;
          }
          h2#tabla {
            text-align: center;
          }
      </style>
  </head>
  <body>
    <div class="container d-flex">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 bg-light">
          <div class="">
            <div class="row g-3 d-flex justify-content-center align-items-center">
                <div class="mt-5 pb-2"><h2>Guardar con Servicio Web REST: </h2></div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-xl-10">
                  <form id="miFormulario" class="form form-control form-control-md mb-2">
                    <div class="mb-1">
                        <label for="nombres" class="form-label">Nombres</label>
                        <input type="text" class="form-control" id="nombres" name="nombres" required>
                    </div>
                    <div class="mb-1">
                        <label for="apellidos" class="form-label">Apellidos</label>
                        <input type="text" class="form-control" id="apellidos" name="apellidos" required>
                    </div>
                    <div class="mb-1">
                        <label for="dni" class="form-label">DNI</label>
                        <input type="number" class="form-control" id="dni" name="dni" required>
                    </div>
                    <div class="container d-flex justify-content-center mt-3 mb-2">
                      <input type="submit" class="btn btn-success btn-sm" value="Guardar con REST">
                    </div>
                  </form>
                </div>
                
            </div>
          
          </div>
        </div>


        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 bg-light">
          <div class="">
              <h2 id="tabla" class="mt-4 pb-2">Listado Consultado con Servicio Web SOAP</h2>
              <table class="table px-5 table-info table-striped table-hover">
                <thead class="table-primary">
                  <tr>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>DNI</th>
                  </tr>
                </thead>
                <tbody>
                  `
                    data.forEach(function (row) {
                        tabla += `
                          <tr>
                            <td>${row.nombres}</td>
                            <td>${row.apellidos}</td>
                            <td>${row.dni}</td>
                          </tr>
                        `;
                    });
                    tabla += 
                  `
                </tbody>
              </table>
          
          </div>
  
        </div>
      </div>

    </div>

    <script>
        document.getElementById('miFormulario').addEventListener('submit', function (event) {
            event.preventDefault();
            let nombres = document.getElementById('nombres').value;
            let apellidos = document.getElementById('apellidos').value;
            let dni = document.getElementById('dni').value;
            enviarDatosAPI(nombres, apellidos, dni);
        });
        function enviarDatosAPI(nombres, apellidos, dni) {
            const urlFetch = 'http://localhost:8080/insertar_con_rest';
            const datos = { 
              nombres, apellidos, dni
            };
            // console.log(nombres)
            // console.log(apellidos)
            // console.log(dni)
            fetch(urlFetch, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta de la API: ', data);
                if (data && data.result) {
                    // Luego de almacenar el registro exitosamente, se recarga la ruta home.
                    window.location.href = 'http://localhost:3000';
                } else {
                    console.error('La API no respondió con éxito:', data);
                }
            })
            .catch(error => {
                console.error('Error al enviar datos a la API:', error);
            });
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
  </body>
  </html>`;

  return tabla
}

const url = `http://${hostWebServSOAP}:8888/consultar_con_soap?wsdl`;

app.get('/', (_req, res) => {
  try {
    // Se realiza la solicitud al servicio web SOAP
    soap.createClient(url, (err, client) => {
      if (err) {
          console.error("Error al crear el cliente SOAP:", err);
          return;
      }
      // Se llama al método configurado en el servicio web SOAP
      client.ConsultarPersonas({}, (err, result) => {
          if (err) {
              console.error("Error al llamar al servicio SOAP:", err);
              return;
          }
          console.log('Probando soap, el result: ', result);
          // Se extraen los datos de la respuesta
          const data = result.Persona;
          // Se devuelven los resultados en una tabla HTML
          const respuesta = displayResults(data);
          return res.send(respuesta);
      });
    });
  } catch (error) {
    console.log('Error en consulta a SOAP: ', error)
    res.json({ msg: error.message})
  }
})

app.listen(port, () => {
  console.log(`Cliente escuchando en http://${hostCliente}:${port}`);
});