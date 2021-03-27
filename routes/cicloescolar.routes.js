 /**
 * Rutas de cicloescolars
 * host + /api/cicloescolars
 */
  const { Router } = require('express');
  const { check } = require('express-validator');
  const { validarCampos } = require('../middlewares/validar-campos');
  // Importamos las funciones del controlador auth
  const { getCycles, getCycleById, createCycle, deleteCycle, updateCycle, findCycles } = require('../controllers/cicloescolar.controller');

  const router = Router();
  
  router.get('/', getCycles );
  router.get('/:id', getCycleById );
  router.get('/find/:buscar', findCycles );
  
  router.post('/',
                  check('nombre', 'El nombre del ciclo es obligatorio').not().isEmpty(),
                  check('fechaInicio', 'La fecha de inicio es obligatoria').not().isEmpty(),
                  check('fechaFin', 'La fecha de fin es obligatoria').not().isEmpty()
                  , validarCampos,
                  createCycle );
  
  router.put('/:id',
                check('nombre', 'El nombre del ciclo es obligatorio').not().isEmpty(),
                check('fechaInicio', 'La fecha de inicio es obligatoria').not().isEmpty(),
                check('fechaFin', 'La fecha de fin es obligatoria').not().isEmpty()
                , validarCampos,
                updateCycle );
  
  router.delete('/:id', deleteCycle );
  
  // Exportamos el router
  module.exports = router;
  