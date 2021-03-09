 /**
 * Rutas de usuarios
 * host + /api/usuarios
 */
  const { Router } = require('express');
  const { check } = require('express-validator');
  const { validarCampos } = require('../middlewares/validar-campos');
  // Importamos las funciones del controlador auth
  const { getUsers, getUserById, createUser, deleteUser, updateUser, findUsers } = require('../controllers/usuario.controller');
  
  const router = Router();
  
  router.get('/', getUsers );
  router.get('/:id', getUserById );
  router.get('/find/:buscar', findUsers );
  
  router.post('/',
                  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                  check('email', 'El email no es valido').isEmail()
                  , validarCampos,
                  createUser );
  
  router.put('/:id',
                  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                  check('email', 'El email no es valido').isEmail()
                  , validarCampos,
                  updateUser );
  
  router.delete('/:id', deleteUser );
  
  // Exportamos el router
  module.exports = router;
  