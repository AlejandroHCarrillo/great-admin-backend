 /**
 * Rutas de alumnos
 * host + /api/alumnos
 */
  const { Router } = require('express');
  const { check } = require('express-validator');
  const { validarCampos } = require('../middlewares/validar-campos');
  // Importamos las funciones del controlador auth
  const { getAlumns, getAlumnById, createAlumn, deleteAlumn, updateAlumn, findAlumns } = require('../controllers/alumno.controller');

  const router = Router();
  
  router.get('/', getAlumns );
  router.get('/:id', getAlumnById );
  router.get('/find/:buscar', findAlumns );
  
  router.post('/',
                  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                  check('code', 'El code no es valido').not().isEmpty()
                  , validarCampos,
                  createAlumn );
  
  router.put('/:id',
                  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                  check('code', 'El email no es valido').not().isEmpty()
                  , validarCampos,
                  updateAlumn );
  
  router.delete('/:id', deleteAlumn );
  
  // Exportamos el router
  module.exports = router;
  