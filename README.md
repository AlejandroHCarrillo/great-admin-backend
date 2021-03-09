# backend-node

## Backend

1. Crear el directorio
2. Inicializar el directorio node que crea un package.json
``` 
npm init -y 
```
3. Crear archivo en la raiz index.js
para ejecutar el archivo de javascript hay que ejecutar
```
node index.js
```
4. Instalar Nodemon, sirve para reiniciar la ejecucion de los scripts cada que cambien.

Instalacion:
```
npm i nodemon -g
```

Uso:
```
nodemon index.js
```

5. Agregar los scripts npm al package.json
```
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
```
Uso:
```
  c:\xxx\npm run dev
  c:\xxx\npm start
```
6. Instalar express
```
npm i express
o
npm i express@4.17.1
```

7. Configurar express en el index.js
```
const express = require('express');
```

8. Crear la app de express
```
const app = express();
```

9. Escuchar las peticiones
```
app.listen(4000, ()=>{
    console.log(`Servidor corriendo en el puerto ${ 4000 }`);
    
  });
```
Listo el back end server esta listo para recibir peticiones

10. Configurar rutas
```
app.get('/', (req, res) => {
    console.log("Requiere poner /");
    res.json({ ok: true});
});
```

11. Establecer ruta publica
```
app.use(express.static('public'));
```

12. Crear archivo de configuracion .env en la raiz y crear las variables de entorno
Ejemplo:
```
VARIABLE=4000
```

instalar dotenv
```
npm i dotenv
```
Uso:
Poner en la seguda linea de index.js
```
require('dotenv').config();
o 
const dotenv = require('dotenv').config();
```

Para acceder a las variables guardadas en el archivo .env hay que usar 
```
process.env.VARIABLE
```

13. Leer y parsear el body
En el index.js:
´´´
app.use( express.json );
´´´
en el controlador:
´´´
    // Obtenemos la informacion del body
    const { name, email, password } = req.body;

    // validamos la longitid del nombre y regresamos un codigo de error
    if (name.length < 5){
        return res.status(400).json({ 
            ok: false,
            msg: 'El nombre debe ser al menos de 5 letras',
        });   
    }
´´´

NOTA: Solo se puede enviar una respuesta por lo que se recomienda poner un return a casa response para que la ejecucion termine al regresarla.

14. Validaciones automaticas
Para evitar hacer el codigo de validaciones manuales dentro de la funcion hay que instalar un validador automatico.

https://express-validator.github.io/docs/

´´´
npm install --save express-validator
o 
npm i express-validator
´´´

Ejemplo de como mandar las validaciones:
´´´
// Configuracion de rutas para que ejecuten una funcion del controlador (createUser)
// Las validaciones se hacen con el check 
// se pueden mandar tantas como sean necesarias, una por cada campo a validar 
router.post('/new',
            check('name', 'El nombre es obligatorio')
                .not().isEmpty(),
            check('email', 'El email no es valido').isEmail(),
            check('password', 'The password must be 5+ chars long and contain a number')
                .not()
                .isIn(['123', 'password', 'god'])
                .withMessage('Do not use a common word as the password')
                .isLength({ min: 5 })
                .matches(/\d/)            
            ,
            createUser );
´´´

## Codigos de estado HTTP

https://www.restapitutorial.com/httpstatuscodes.html

* 1xx Informational
* 2xx Success
* 3xx Redirection
* 4xx Client Error
* 5xx Server Error

15. Conexion a base de datos Mongo DB usando Mongoose

## Base de datos en la nube MongoDB Atlas

Implemente MongoDB en la nube con solo unos pocos clics. Atlas se basa en la mejor automatización de su clase y prácticas comprobadas que ayudan a proporcionar disponibilidad continua, escalabilidad elástica, rendimiento rápido y soporte con cumplimiento normativo. Es la forma más sencilla de probar MongoDB gratis en AWS, Google Cloud y Azure.

https://www.mongodb.com/

https://www.mongodb.com/try

https://cloud.mongodb.com/v2/60272ad42d797c3de3467d96#security/database/users

## Mongoose

Mongoose es un ORM que proporciona una solución sencilla basada en esquemas para modelar los datos de su aplicación. Incluye conversión de tipo integrada, validación, creación de consultas, enlaces de lógica empresarial y más, listo para usar.

https://mongoosejs.com/

```
npm install mongoose --save
o 
npm i mongoose
```

Crear archivo config.js en el un nuevo folder llamado database
```
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));
```
### Encriptar los passwords
https://www.npmjs.com/package/bcryptjs

```
npm install bcryptjs
```

Para encriptar un password:
```
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);
```

To check a password:
```
// Load hash from your password DB.
bcrypt.compareSync("B4c0/\/", hash); // true
bcrypt.compareSync("not_bacon", hash); // false
```

### Jason Web Tocken JWT

https://jwt.io/

Instalacion: 
``` 
npm i jsonwebtoken
```  

Ejemplo de uso: 
``` 
const jwt = require('jsonwebtoken');

// Generar el token
const token = await generateJWT(uid, name);

// Verificar token
const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);        

``` 

### Habilitar CORS

https://www.npmjs.com/package/cors

https://enable-cors.org/

Install : 
``` 
npm i cors
``` 

Uso: 
``` 
// Habilitar CORS
app.use('cors');
``` 


### Colores de consola
https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
