 /**
 * Rutas de clientes
 * host + /api/clientes
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
// Importamos las funciones del controlador auth
const { getClients, getClientById, createClient, deleteClient, updateClient, findClients } = require('../controllers/cliente.controller');

const router = Router();

router.get('/', getClients );
router.get('/:id', getClientById );
router.get('/find/:buscar', findClients );

router.post('/',
                check('nombre', 'El nombre completo es obligatorio').not().isEmpty(),
                check('email', 'El email no es valido').isEmail()
                , validarCampos,
                createClient );

router.put('/:id',
                check('nombre', 'El nombre completo es obligatorio').not().isEmpty(),
                check('email', 'El email no es valido').isEmail()
                , validarCampos,
                updateClient );

router.delete('/:id', deleteClient );

// Exportamos el router
module.exports = router;
