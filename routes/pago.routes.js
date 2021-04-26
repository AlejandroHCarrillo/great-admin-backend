 /**
 * Rutas de pagos
 * host + /api/pagos
 */
  const { Router } = require('express');
  const { check } = require('express-validator');
  const { validarCampos } = require('../middlewares/validar-campos');
  // Importamos las funciones del controlador auth
  const { getPagos, getPagoById, findPagosByAlumn, createPago, deletePago, updatePago, findPagos, getPagosReport, getPagosReportbyFormaPago } = require('../controllers/pago.controller');

  const router = Router();
  
  router.get('/', getPagos );
  router.get('/:id', getPagoById );
  router.get('/find/:buscar', findPagos );
  router.get('/alumno/:id', findPagosByAlumn );
  router.get('/report/:year', getPagosReport );
  router.get('/report/formaPago/:year', getPagosReportbyFormaPago );
  
  router.post('/',
                  check('fechapago', 'La fecha del pago es obligatoria').not().isEmpty(),
                  check('alumno', 'El alumno es obligatorio').not().isEmpty(),
                  check('formapago', 'La forma de pago es obligatoria').not().isEmpty(),
                  check('montopagado', 'El monto pagado es obligatorio').not().isEmpty()
                  , validarCampos,
                  createPago );
  
  router.put('/:id',
                    check('fechapago', 'La fecha del pago es obligatoria').not().isEmpty(),
                    check('alumno', 'El alumno es obligatorio').not().isEmpty(),
                    check('formapago', 'La forma de pago es obligatoria').not().isEmpty(),
                    check('montopagado', 'El monto pagado es obligatorio').not().isEmpty()
                  , validarCampos,
                  updatePago );
  
  router.delete('/:id', deletePago );
  
  // Exportamos el router
  module.exports = router;
  