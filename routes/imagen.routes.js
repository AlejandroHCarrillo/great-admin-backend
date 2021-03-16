 /**
 * Rutas de imagens
 * host + /api/imagens
 */
  const { Router } = require('express');
  const { check } = require('express-validator');
  const { validarCampos } = require('../middlewares/validar-campos');
  // Importamos las funciones del controlador auth
  const { getImages, getImageById, createImage, deleteImage, updateImage, findImages } = require('../controllers/imagen.controller');

  const router = Router();
  
  router.get('/', getImages );
  router.get('/:id', getImageById );
  router.get('/find/:buscar', findImages );
  
  router.post('/',
                check('tipoCatalogo', 'El catalogo es obligatorio').not().isEmpty(),
                check('url', 'La URL de la imagen es obligatoria').not().isEmpty()
                , validarCampos,
                createImage );
  
  router.put('/:id',
                check('tipoCatalogo', 'El catalogo es obligatorio').not().isEmpty(),
                check('url', 'La URL de la imagen es obligatoria').not().isEmpty()
                , validarCampos,
                  updateImage );
  
  router.delete('/:id', deleteImage );
  
  // Exportamos el router
  module.exports = router;
  