/**
 * Rutas de cargos
 * host + /api/cargos
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
// Importamos las funciones del controlador auth
const { getCharges, getChargeById, getChargesByAlumn, createCharge, createCharges, deleteCharge, updateCharge, findCharges } = require('../controllers/cargo.controller');

const router = Router();

router.get('/', getCharges );
router.get('/:id', getChargeById );
router.get('/find/:buscar', findCharges );
router.get('/alumno/:id', getChargesByAlumn );

router.post('/',
                check('alumno', 'El alumno es obligatorio').not().isEmpty(),
                // check('producto', 'El producto es obligatorio').not().isEmpty(),
                check('fechavencimiento', 'La fecha de vencimiento es obligatoria').not().isEmpty()
                , validarCampos,
                createCharge );

router.post('/cargos/', createCharges );

router.put('/:id',
                check('alumno', 'El nombre es obligatorio').not().isEmpty(),
                // check('producto', 'El producto es obligatorio').not().isEmpty(),
                check('fechavencimiento', 'La fecha de vencimiento es obligatoria').not().isEmpty()
                , validarCampos,
                updateCharge );

router.delete('/:id', deleteCharge );

// Exportamos el router
module.exports = router;
