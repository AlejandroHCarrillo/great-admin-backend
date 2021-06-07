 /**
 * Rutas de alumnos
 * host + /api/alumnos
 */
  const { Router } = require('express');
  const { check } = require('express-validator');
  const { validarCampos } = require('../middlewares/validar-campos');
  // Importamos las funciones del controlador auth
  const { getAlumns, getAlumnById, createAlumn, deleteAlumn, updateAlumn, findAlumns } = require('../controllers/alumno.controller');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt');

  const router = Router();
  
  router.get('/', getAlumns );
  router.get('/:id', getAlumnById );
  router.get('/find/:buscar', findAlumns );
  
  router.post('/',
                  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                  check('apaterno', 'El apellido es obligatorio').not().isEmpty(),
                  check('fechaNacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty()
                  , validarCampos,
                  validarJWT,
                  validarADMIN_ROLE,
                  createAlumn );
  
  router.put('/:id',check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                    check('apaterno', 'El apellido es obligatorio').not().isEmpty(),
                    check('fechaNacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty()
                    , validarCampos,
                    validarJWT,
                    validarADMIN_ROLE,
                    updateAlumn );
  
  router.delete('/:id', validarJWT, validarADMIN_ROLE, deleteAlumn );
  
  // Exportamos el router
  module.exports = router;
  