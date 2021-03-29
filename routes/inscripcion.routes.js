/**
 * Rutas de inscripciones
 * host + /api/inscripciones
 */
 const { Router } = require('express');
 const { check } = require('express-validator');
 const { validarCampos } = require('../middlewares/validar-campos');
 // Importamos las funciones del controlador auth
 const { getInscriptions, getInscriptionById, createInscription, createInscriptions, deleteInscription, updateInscription, findInscriptions } = require('../controllers/inscripcion.controller');
 
 const router = Router();
 
 router.get('/', getInscriptions );
 router.get('/:id', getInscriptionById );
 router.get('/find/:buscar', findInscriptions );
 
 router.post('/',
                 check('alumno', 'El alumno es obligatorio').not().isEmpty(),
                 check('cicloescolar', 'El cicloescolar es obligatorio').not().isEmpty()
                 , validarCampos,
                 createInscription );
  
 router.put('/:id',
                 check('alumno', 'El nombre es obligatorio').not().isEmpty(),
                 check('cicloescolar', 'El apellido es obligatorio').not().isEmpty()
                 , validarCampos,
                 updateInscription );
 
 router.delete('/:id', deleteInscription );
 
 // Exportamos el router
 module.exports = router;