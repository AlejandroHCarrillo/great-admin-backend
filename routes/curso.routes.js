/**
 * Rutas de cursos
 * host + /api/cursos
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
// Importamos las funciones del controlador auth
const { getCourses, getCoursesWithCharges, getCourseById, createCourse, deleteCourse, 
        updateCourse, findCourses, createCourseCharge, updateCourseCharge, removeCharge } = require('../controllers/curso.controller');

const router = Router();

router.get('/', getCoursesWithCharges );
router.get('/:id', getCourseById );
router.get('/find/:buscar', findCourses );

router.post('/',
                check('code', 'El codigo del curso es obligatorio').not().isEmpty(),
                check('nombre', 'El nombre del curso es obligatorio').not().isEmpty(),
                check('fechaprimerpago', 'La fecha de pago es obligatoria').not().isEmpty()
                , validarCampos,
                createCourse );

router.post('/cargo/',
                check('nombre', 'El nombre cargp del curso es obligatorio').not().isEmpty(),
                check('precio', 'El precio cargo del curso es obligatorio').not().isEmpty(),
                validarCampos,
                createCourseCharge );

router.put('/:id',
                check('code', 'El codigo del curso es obligatorio').not().isEmpty(),
                check('nombre', 'El nombre del curso es obligatorio').not().isEmpty(),
                check('fechaprimerpago', 'La fecha de pago es obligatoria').not().isEmpty()
                , validarCampos,
                    updateCourse );

router.put('/cargo/:id',
                check('nombre', 'El nombre cargp del curso es obligatorio').not().isEmpty(),
                check('precio', 'El precio cargo del curso es obligatorio').not().isEmpty(),
                validarCampos,
                updateCourseCharge );

router.delete('/:id', deleteCourse );
router.delete('/cargo/:id', removeCharge );

// Exportamos el router
module.exports = router;