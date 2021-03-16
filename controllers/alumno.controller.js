/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de alumnos
 */
 const { response } = require('express');
 PAGESIZE = require("../config/config").PAGESIZE;
 const Alumno = require('../models/alumno.model');
 
 const getAlumnById = async(req, res = response ) => {
     const alumnoId = req.params.id;
     try{
         const alumno = await Alumno.findById( alumnoId );
 
         if (!alumno) {
             return res.status(404).json({
                 ok:false,
                 msg: '[Alumno get] El alumno no existe'
             })            
         }
 
         res.status(200).json({ 
             ok: true,
             alumno
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Alumnos get] Hubo un error, contacte al administrador`,
         });
     }
 }
 
  const getAlumns = async(req, res = response ) => {
     var desde = req.query.desde || 0;
     desde = Number(desde);
     // console.log("desde: ", desde);
 
     var pagesz = req.query.records || PAGESIZE;
     pagesz = Number(pagesz);
     // console.log("pagesz: ", pagesz);
 
     var sortBy = req.query.sort || 'apaterno';
     sortBy = String(sortBy);
    //  console.log("sortBy: ", sortBy);
 
     try{
         Alumno.find({}, "nombre apaterno amaterno email img activo matricula")
         .sort(sortBy)
         .skip(desde)
         .limit(pagesz)
         .exec((err, alumnos) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando alumnos",
               errors: err
             });
           }
           Alumno.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               alumnos: alumnos,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Alumnos get] Hubo un error, contacte al administrador`,
         });
     }
 }
  
const createAlumn = async(req, res = response ) => { 
    console.log("Creando Alumno:");
    console.log("Actualizando alumno: ", req.body );
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
    console.log("uid", uid);
    try{
        alumno = new Alumno(req.body);
        alumno.fechaalta = new Date();
        alumno.usuarioalta = uid;
        alumno.fechaactualizacion = new Date();
        alumno.usuarioactualizacion = uid;

        await alumno.save();
          
        res.status(201).json({ 
            ok: true,
            msg: `Alumno ${ alumno.name } ha sido registrado con exito`,
            id: alumno.id,
            name: alumno.name
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
 
  const updateAlumn = async(req, res = response ) => {
     console.log("Actualizando alumno: ", req );
     const alumnoId = req.params.id;
     const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
 
     try{
         const alumno = await Alumno.findById( alumnoId );
 
         if (!alumno){
             return res.status(404).json({
                 ok:false,
                 msg: '[Alumno Update] El alumno no se pudo actualizar por que no existe'
             });
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar alumnos 
         // if ( alumnoUserId.toString() !== uid.toString() ){
         // if ( alumno.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Alumno Delete] El alumno solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const nuevoAlumno = {
             ...req.body,
             fechaactualizacion : new Date(),
             usuarioactualizacion : uid
         }
         const alumnoActualizado = await Alumno.findByIdAndUpdate(alumnoId, nuevoAlumno, { new: true } );
 
         // console.log( alumnoActualizado );
         return res.status(200).json({ 
             ok: true,
             alumno: alumnoActualizado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Alumno Update] Hubo un error, contacte al administrador`,
         });
     }
 }
  
 
  const deleteAlumn = async(req, res = response ) => {
     // console.log("Eliminando alumno: ", req );
     const alumnoId = req.params.id;
     const uid = req.uid;
 
     try{
         const alumno = await Alumno.findById( alumnoId );
 
         if (!alumno){
             return res.status(404).json({
                 ok:false,
                 msg: '[Alumno Delete] El alumno no se pudo eliminar, por que no existe'
             })            
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar alumnos 
         // if ( alumnoUserId.toString() !== uid.toString() ){
         // if ( alumno.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Alumno Delete] El alumno solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const alumnoEliminado = await Alumno.findByIdAndDelete( alumnoId  );
         
         return res.status(200).json({ 
             ok: true,
             alumno: alumnoEliminado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Alumno Delete] Hubo un error, contacte al administrador`,
         });
 
     }
 }
 
 const findAlumns = async (req, res = response) => {
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
 
    //  console.log("buscando alumnos: ", regex );
 
     try{
         Alumno.find({}, "nombre apaterno amaterno activo email img matricula")
                .or([
                     { nombre: regex },
                     { apaterno: regex },
                     { amaterno: regex },
                     { matricula: regex },
                     { email: regex }
                     ])
         .sort(sortBy)
         // .skip(desde)
         // .limit(pagesz)
         .exec((err, alumnos) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando alumnos",
               errors: err
             });
           }
           Alumno.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               alumnos: alumnos,
               found: Object.keys(alumnos).length,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Alumnos get] Hubo un error, contacte al administrador`,
         });
     }

 }
  
 module.exports = {
     getAlumnById,    
     getAlumns,
     findAlumns,
     createAlumn,
     updateAlumn,
     deleteAlumn
  };