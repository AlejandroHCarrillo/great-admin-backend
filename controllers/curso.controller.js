/**
 * Este controlador regresa las respuestas a las rutas solicitadas de cursos
 */
const { response } = require('express');
PAGESIZE = require("../config/config").PAGESIZE;
const Curso = require('../models/curso.model');
const CargosCurso = require('../models/curso.cargo.model');
const { ObjectId } = require('bson');

const getCourseById = async(req, res = response ) => {
    const cursoId = req.params.id;
    try{
        const curso = await Curso.findById( cursoId );

        if (!curso) {
            return res.status(404).json({
                ok:false,
                msg: '[Curso get] El curso no existe'
            })            
        }

        res.status(200).json({ 
            ok: true,
            curso
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cursos get] Hubo un error, contacte al administrador`,
        });
    }
}
 
const getCourses = async(req, res = response ) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    // console.log("desde: ", desde);

    var pagesz = req.query.records || PAGESIZE;
    pagesz = Number(pagesz);
    // console.log("pagesz: ", pagesz);

    var sortBy = req.query.sort || 'nombre';
    sortBy = String(sortBy);
//  console.log("sortBy: ", sortBy);

    try{
        await Curso.find({}, "nombre code descripcion nivel grado fechaprimerpago intervalopagos estatus cargos")
        .sort(sortBy)
        .skip(desde)
        .limit(pagesz)
        .exec((err, cursos) => {
            if (err) {
                return res.status(500).json({
                ok: false,
                mensaje: "Error cargando cursos",
                errors: err
                });
            }

            Curso.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                ok: true,
                cursos: Cursos,
                total: conteo
                });
            });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cursos get] Hubo un error, contacte al administrador`,
        });
    }
}

const getCoursesWithCharges = async(req, res = response ) => {
    console.log("getCoursesWithCharges: ", getCoursesWithCharges );

    var desde = req.query.desde || 0;
    desde = Number(desde);
    // console.log("desde: ", desde);

    var pagesz = req.query.records || PAGESIZE;
    pagesz = Number(pagesz);
    // console.log("pagesz: ", pagesz);

    var sortBy = req.query.sort || 'nombre';
    sortBy = String(sortBy);
//  console.log("sortBy: ", sortBy);

    try{
        await Curso.find({}, "")
        // .populate("curso")
        // .sort(sortBy)
        // .skip(desde)
        // .limit(pagesz)
        .exec(async (err, cursos) => {
            if (err) {
                return res.status(500).json({
                ok: false,
                mensaje: "Error cargando cursos",
                errors: err
                });
            }

            let nCursos = [];
            cursos.forEach(async (cursoItem) => {
                let cargosCurso = [];
                let numcargos =  0;
                CargosCurso.find({}).or( [ { curso: new ObjectId(cursoItem.id) } ] )
                .exec((err, cargos) => {
                    if(cargos){
                        // console.log("Cargos: ", cargos);
                        cargos.forEach(cargoItem => {
                            cargosCurso.push({
                                id: cargoItem.id,
                                precio: cargoItem.precio,
                                tasaIVA: cargoItem.tasaIVA,
                                monto: cargoItem.monto,
                                numpagos: cargoItem.numpagos,
                                nombre: cargoItem.nombre,
                                producto: cargoItem.producto
                            });
                        });
                    }

                    nCursos.push({
                        id: cursoItem.id,
                        code: cursoItem.code,
                        nombre: cursoItem.nombre,
                        descripcion: cursoItem.descripcion,
                        nivel: cursoItem.nivel,
                        grado: cursoItem.grado,
                        intevalopagos: cursoItem.intervalopagos,
                        estatus: cursoItem.estatus,
                        numcargos: cargosCurso.length,
                        cargos: cargosCurso
                    })

                });
            });

            Curso.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                ok: true,
                cursos: nCursos,
                total: conteo
                });
            });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cursos get] Hubo un error, contacte al administrador`,
        });
    }
}


const createCourse = async(req, res = response ) => { 
    console.log("Creando Curso:", req.body );
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
    console.log("uid", uid);

    let cargos = req.body.cargos;
    try{
        curso = new Curso(req.body);
        curso.fechaalta = new Date();
        curso.usuarioalta = uid;
        curso.fechaactualizacion = new Date();
        curso.usuarioactualizacion = uid;

        await curso.save();

        cargos.forEach(element => {
            console.log("Cargo: ", element);
            let cargotemp = {
                nombre: element.nombre,
                precio: element.precio,
                tasaIVA: element.tasaIVA,
                monto: element.monto,
                numpagos: element.numpagos,
                producto: new ObjectId(element.producto),
                curso: new ObjectId(curso._id),

                fechaalta : new Date(),
                usuarioalta : uid,
                fechaactualizacion : new Date(),
                usuarioactualizacion : uid
            }

            console.log("Cargo: ", cargotemp);
            let cargo = new Cargo(cargotemp);
            // cargo.Curso = new Id()

            cargo.save(cargotemp);
        });
    
          
        res.status(201).json({ 
            ok: true,
            msg: `Curso ${ curso.nombre } ha sido registrado con exito`,
            id: curso.id,
            nombre: curso.nombre
        });
  
    } catch( error ){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, por favor contacte a su admistrador',
            error
        })
    }
};
 
const updateCourse = async(req, res = response ) => {
    console.log("Actualizando curso: ", req.body );
    const cursoId = req.params.id;
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;

    try{
        const curso = await Curso.findById( cursoId );

        if (!curso){
            return res.status(404).json({
                ok:false,
                msg: '[Curso Update] El curso no se pudo actualizar por que no existe'
            });
        }

        // TODO: habilitar rol de administrador para que pueda borrar cursos 
        // if ( cursoUserId.toString() !== uid.toString() ){
        // if ( curso.user.toString() !== uid ){
        //     return res.status(401).json({
        //         ok:false,
        //         msg: '[Curso Delete] El curso solo puede ser eliminado por el propietario o el administrador'                
        //     })            
        // }
        
        const nuevoCurso = {
            ...req.body,
            fechaactualizacion : new Date(),
            usuarioactualizacion : uid
        }
        const cursoActualizado = await Curso.findByIdAndUpdate(cursoId, nuevoCurso, { new: true } );

        // console.log( cursoActualizado );
        return res.status(200).json({ 
            ok: true,
            curso: cursoActualizado
        });

    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Curso Update] Hubo un error, contacte al administrador`,
        });
    }
}
  
 
const deleteCourse = async(req, res = response ) => {
     // console.log("Eliminando curso: ", req );
     const cursoId = req.params.id;
     const uid = req.uid;
 
     try{
         const curso = await Curso.findById( cursoId );
 
         if (!curso){
             return res.status(404).json({
                 ok:false,
                 msg: '[Curso Delete] El curso no se pudo eliminar, por que no existe'
             })            
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar cursos 
         // if ( cursoUserId.toString() !== uid.toString() ){
         // if ( curso.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Curso Delete] El curso solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const cursoEliminado = await Curso.findByIdAndDelete( cursoId  );
         
         return res.status(200).json({ 
             ok: true,
             curso: cursoEliminado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Curso Delete] Hubo un error, contacte al administrador`,
         });
 
     }
}
 
const findCourses = async (req, res = response) => {
    var busqueda = req.params.buscar;
    var regex = new RegExp(busqueda, "i");

    var desde = req.query.desde || 0;
    desde = Number(desde);
    //  console.log("desde: ", desde);

    var pagesz = req.query.records || PAGESIZE;
    pagesz = Number(pagesz);
    //  console.log("pagesz: ", pagesz);

    var sortBy = req.query.sort || 'apaterno';
    sortBy = String(sortBy);
    //  console.log("sortBy: ", sortBy);

    //  console.log("buscando cursos: ", regex );
 
     try{
         Curso.find({}, "nombre code descripcion nivel grado fechaprimerpago intervalopagos estatus")
                .or([
                     { nombre: regex },
                     { code: regex },
                     { descripcion: regex },
                     { nivel: regex },
                     { grado: regex }
                     ])
         .sort(sortBy)
         // .skip(desde)
         // .limit(pagesz)
         .exec((err, cursos) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando cursos",
               errors: err
             });
           }
           Curso.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               cursos: cursos,
               found: Object.keys(cursos).length,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Cursos get] Hubo un error, contacte al administrador`,
         });
     }
}



 module.exports = {
     getCourseById,    
     getCourses,
     getCoursesWithCharges,
     findCourses,
     createCourse,
     updateCourse,
     deleteCourse
  };