 /**
 * Rutas de roles
 * host + /api/roles
 */
  const { Router } = require('express');
  const { check } = require('express-validator');
  const { validarCampos } = require('../middlewares/validar-campos');
  // Importamos las funciones del controlador auth
  const { getRoles, getRoleById, createRole, deleteRole, updateRole, findRoles } = require('../controllers/auth.role.controller');

  const router = Router();
  
  router.get('/', getRoles );
  router.get('/:id', getRoleById );
  router.get('/find/:buscar', findRoles );
  
  router.post('/',
            check('nombre', 'El nombre del ciclo es obligatorio').not().isEmpty(),
            validarCampos,
            createRole );

  router.put('/:id',
            check('nombre', 'El nombre del ciclo es obligatorio').not().isEmpty(),
            validarCampos,
            updateRole );
  
  router.delete('/:id', deleteRole );
  
  // Exportamos el router
  module.exports = router;
  