 /**
 * Rutas de productos
 * host + /api/productos
 */
  const { Router } = require('express');
  const { check } = require('express-validator');
  const { validarCampos } = require('../middlewares/validar-campos');
  // Importamos las funciones del controlador auth
  const { getProducts, getProductById, createProduct, deleteProduct, updateProduct, findProducts } = require('../controllers/producto.controller');

  const router = Router();
  
  router.get('/', getProducts );
  router.get('/:id', getProductById );
  router.get('/find/:buscar', findProducts );
  
  router.post('/',
                  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                  check('code', 'El code no es valido').not().isEmpty()
                  , validarCampos,
                  createProduct );
  
  router.put('/:id',
                  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                  check('code', 'El email no es valido').not().isEmpty()
                  , validarCampos,
                  updateProduct );
  
  router.delete('/:id', deleteProduct );
  
  // Exportamos el router
  module.exports = router;
  