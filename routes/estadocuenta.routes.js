/**
 * Rutas de correos
 * host + /api/correos
 */
 const { Router } = require('express');

 // Importamos las funciones del controlador auth
 const { getEstadoCuentaByMatricula, getAlumns, getEstadoCuentaReport, getListaEstadosCuenta } = require('../controllers/estadocuenta.controller');
 
 const router = Router();
 
 router.get('/alumnos/', getAlumns );
 router.get('/alumno/:matricula', getEstadoCuentaByMatricula );
 router.get('/resumen/:matricula', getEstadoCuentaReport );
 router.get('/:lista', getListaEstadosCuenta );
 
 // Exportamos el router
 module.exports = router;