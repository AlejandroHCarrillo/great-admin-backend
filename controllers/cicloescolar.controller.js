/**
 * Este controlador regresa las respuestas a las rutas solicitadas para los ciclos escolares
 */
 const { response } = require('express');
 PAGESIZE = require("../config/config").PAGESIZE;
 const CicloEscolar = require('../models/cicloescolar.model');
 
 const getCycleById = async(req, res = response ) => {
     const cicloescolarId = req.params.id;
     try{
         const cicloescolar = await CicloEscolar.findById( cicloescolarId );
 
         if (!cicloescolar) {
             return res.status(404).json({
                 ok:false,
                 msg: '[Cicloescolar get] El cicloescolar no existe'
             })            
         }
 
         res.status(200).json({ 
             ok: true,
             cicloescolar
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Cicloescolars get] Hubo un error, contacte al administrador`,
         });
     }
 }
 
  const getCycles = async(req, res = response ) => {
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
         CicloEscolar.find({}, "nombre apaterno amaterno email img activo matricula")
         .sort(sortBy)
         .skip(desde)
         .limit(pagesz)
         .exec((err, cicloescolars) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando cicloescolars",
               errors: err
             });
           }
           CicloEscolar.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               cicloescolars: cicloescolars,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Cicloescolars get] Hubo un error, contacte al administrador`,
         });
     }
 }
  
const createCycle = async(req, res = response ) => { 
    console.log("Creando Cicloescolar:");
    console.log("Actualizando cicloescolar: ", req.body );
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
    console.log("uid", uid);
    try{
        cicloescolar = new CicloEscolar(req.body);
        cicloescolar.fechaalta = new Date();
        cicloescolar.usuarioalta = uid;
        cicloescolar.fechaactualizacion = new Date();
        cicloescolar.usuarioactualizacion = uid;

        await cicloescolar.save();
          
        res.status(201).json({ 
            ok: true,
            msg: `Cicloescolar ${ cicloescolar.nombre } ha sido registrado con exito`,
            id: cicloescolar.id,
            name: cicloescolar.name
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
 
  const updateCycle = async(req, res = response ) => {
     console.log("Actualizando cicloescolar: ", req );
     const cicloescolarId = req.params.id;
     const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
 
     try{
         const cicloescolar = await CicloEscolar.findById( cicloescolarId );
 
         if (!cicloescolar){
             return res.status(404).json({
                 ok:false,
                 msg: '[Cicloescolar Update] El cicloescolar no se pudo actualizar por que no existe'
             });
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar cicloescolars 
         // if ( cicloescolarUserId.toString() !== uid.toString() ){
         // if ( cicloescolar.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Cicloescolar Delete] El cicloescolar solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const nuevoCicloescolar = {
             ...req.body,
             fechaactualizacion : new Date(),
             usuarioactualizacion : uid
         }
         const cicloescolarActualizado = await CicloEscolar.findByIdAndUpdate(cicloescolarId, nuevoCicloescolar, { new: true } );
 
         // console.log( cicloescolarActualizado );
         return res.status(200).json({ 
             ok: true,
             cicloescolar: cicloescolarActualizado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Cicloescolar Update] Hubo un error, contacte al administrador`,
         });
     }
 }
  
 
  const deleteCycle = async(req, res = response ) => {
     // console.log("Eliminando cicloescolar: ", req );
     const cicloescolarId = req.params.id;
     const uid = req.uid;
 
     try{
         const cicloescolar = await CicloEscolar.findById( cicloescolarId );
 
         if (!cicloescolar){
             return res.status(404).json({
                 ok:false,
                 msg: '[Cicloescolar Delete] El cicloescolar no se pudo eliminar, por que no existe'
             })            
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar cicloescolars 
         // if ( cicloescolarUserId.toString() !== uid.toString() ){
         // if ( cicloescolar.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Cicloescolar Delete] El cicloescolar solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const cicloescolarEliminado = await CicloEscolar.findByIdAndDelete( cicloescolarId  );
         
         return res.status(200).json({ 
             ok: true,
             cicloescolar: cicloescolarEliminado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Cicloescolar Delete] Hubo un error, contacte al administrador`,
         });
 
     }
 }
 
 const findCycles = async (req, res = response) => {
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
 
    //  console.log("buscando cicloescolars: ", regex );
 
     try{
         CicloEscolar.find({}, "nombre apaterno amaterno activo email img nivel grado grupo matricula")
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
         .exec((err, cicloescolars) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando cicloescolars",
               errors: err
             });
           }
           CicloEscolar.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               cicloescolars: cicloescolars,
               found: Object.keys(cicloescolars).length,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Cicloescolars get] Hubo un error, contacte al administrador`,
         });
     }

 }
  
 module.exports = {
     getCycleById,    
     getCycles,
     findCycles,
     createCycle,
     updateCycle,
     deleteCycle
  };