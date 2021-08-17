 /**
 * Rutas de pantallas
 * host + /api/pantallas
 */
  const { Router } = require('express');
  const { check } = require('express-validator');
  const { validarCampos } = require('../middlewares/validar-campos');
  // Importamos las funciones del controlador auth
  const { getPantallas, getPantallaById, createPantalla, deletePantalla, updatePantalla, findPantallas } = require('../controllers/auth.pantalla.controller');

  const router = Router();
  
  router.get('/', getPantallas );
  router.get('/:id', getPantallaById );
  router.get('/find/:buscar', findPantallas );
  
  router.post('/',
            check('nombre', 'El nombre del ciclo es obligatorio').not().isEmpty(),
            validarCampos,
            createPantalla );

  router.put('/:id',
            check('nombre', 'El nombre del ciclo es obligatorio').not().isEmpty(),
            validarCampos,
            updatePantalla );
  
  router.delete('/:id', deletePantalla );
  
  // Exportamos el router
  module.exports = router;
  