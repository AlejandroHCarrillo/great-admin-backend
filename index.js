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
const usuariosRoutes = require('./routes/usuario.routes');
const clientesRoutes = require('./routes/cliente.routes');
const productosRoutes = require('./routes/producto.routes');
const alumnosRoutes = require('./routes/alumno.routes');
const cargosRoutes = require('./routes/cargo.routes');
const pagosRoutes = require('./routes/pago.routes');
const ciclosescolaresRoutes = require('./routes/cicloescolar.routes');
const inscripcionesRoutes = require('./routes/inscripcion.routes');
const cursosRoutes = require('./routes/curso.routes');
const imagenRoutes = require('./routes/imagen.routes');
const correosRoutes = require('./routes/correo.routes');
const estadocuentaRoutes = require('./routes/estadocuenta.routes');
const roleRoutes = require('./routes/auth.role.routes');
const pantallasRoutes = require('./routes/auth.pantalla.routes');

const loginRoutes = require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const medicoRoutes = require('./routes/medico');
const busquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
const imagenesRoutes = require('./routes/imagenes');

// Rutas TODO: Separar los controladores de los archivos de rutas
// usar los middlewares dentro de las rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuario', usuariosRoutes);
app.use('/api/producto', productosRoutes);
app.use('/api/cliente', clientesRoutes);
app.use('/api/alumno', alumnosRoutes);
app.use('/api/cargo', cargosRoutes);
app.use('/api/pago', pagosRoutes);
app.use('/api/cicloescolar', ciclosescolaresRoutes);
app.use('/api/inscripcion', inscripcionesRoutes);
app.use('/api/curso', cursosRoutes);
app.use('/api/correo', correosRoutes);
app.use('/api/imagen', imagenRoutes);

app.use('/api/estadocuenta', estadocuentaRoutes);

app.use('/api/login', loginRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/pantallas', pantallasRoutes)

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
