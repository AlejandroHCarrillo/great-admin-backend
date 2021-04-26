/**
 * Rutas de correos
 * host + /api/correos
 */
 const { Router } = require('express');

 // Importamos las funciones del controlador auth
 const { enviarCorreo } = require('../controllers/email.controller');
 
 const router = Router();
 
 router.post('/', enviarCorreo );
 
 // Exportamos el router
 module.exports = router;