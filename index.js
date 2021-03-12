const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const { cons_color } = require('./config/console-colors');

require('dotenv').config();

// console.log(process.env);

// Crea el servidor express
const app = express();

// Conexion a la base de datos
dbConnection();

// Habilitar CORS
app.use(cors())

// Directorio publico
app.use(express.static('public'));

// Leer y parsear el body
app.use( express.json() );

// Importar Rutas 
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario.routes');
const clienteRoutes = require('./routes/cliente.routes');
const productoRoutes = require('./routes/producto.routes');
const alumnoRoutes = require('./routes/alumno.routes');

const loginRoutes = require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const medicoRoutes = require('./routes/medico');
const busquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
const imagenesRoutes = require('./routes/imagenes');

// Rutas TODO: Separar los controladores de los archivos de rutas
// usar los middlewares dentro de las rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuario', usuarioRoutes);
app.use('/api/producto', productoRoutes);
app.use('/api/cliente', clienteRoutes);
app.use('/api/alumno', alumnoRoutes);

app.use('/api/login', loginRoutes)

app.use('/api/img', imagenesRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/busqueda', busquedaRoutes)
app.use('/api/hospital', hospitalRoutes)
app.use('/api/medico', medicoRoutes)


app.use('/api/', appRoutes)

// Escuchar peticiones
app.listen(process.env.PORT, ()=>{
    const {BgBlue, FgWhite, Reset} = cons_color;

    console.log(BgBlue, FgWhite, 
      `Servidor corriendo en el puerto ${ process.env.PORT }`, 
      Reset);
  });
