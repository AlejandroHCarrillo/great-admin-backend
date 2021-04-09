/**
 * Este controlador regresa las respuestas a las rutas solicitadas para los ciclos escolares
 */
 const { response } = require('express');
 PAGESIZE = require("../config/config").PAGESIZE;
 const CicloEscolar = require('../models/cicloescolar.model');
 
const getCycleById = async(req, res = response ) => {
     const cicloescolarId = req.params.id;
     try{
         const ciclosescolares = await CicloEscolar.findById( cicloescolarId );
 
         if (!ciclosescolares) {
             return res.status(404).json({
                 ok:false,
                 msg: '[cicloescolar get] El ciclo escolar no existe'
             })            
         }
 
         res.status(200).json({ 
             ok: true,
             ciclosescolares
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Ciclos escolares get] Hubo un error, contacte al administrador`,
         });
     }
 }
 
const getCycles = async(req, res = response ) => {
    // console.log("getCycles...");

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
        CicloEscolar.find({}, "nombre fechaInicio fechaFin activo")
        .sort(sortBy)
        .skip(desde)
        .limit(pagesz)
        .exec((err, ciclosescolares) => {
        if (err) {
            return res.status(500).json({
            ok: false,
            mensaje: "Error cargando ciclosescolares",
            errors: err
            });
        }
    //    console.log("showActivos: ", showActivos, ciclosescolares);

        CicloEscolar.countDocuments({}, (err, conteo) => {
            res.status(200).json({
            ok: true,
            ciclosescolares: ciclosescolares,
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
    // console.log("Creando Cicloescolar:", req.body );
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
            msg: `El Ciclo escolar ${ cicloescolar.nombre } ha sido greado con exito`,
            id: cicloescolar.id,
            nombre: cicloescolar.nombre
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
    //  console.log("Actualizando cicloescolar: ", req );
     const cicloescolarId = req.params.id;
     const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
 
     try{
         const cicloescolar = await CicloEscolar.findById( cicloescolarId );
 
         if (!cicloescolar){
             return res.status(404).json({
                 ok:false,
                 msg: '[ciclo escolar Update] El ciclo escolar no se pudo actualizar por que no existe'
             });
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar ciclosescolares 
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
             msg: `[ciclo escolar Update] Hubo un error, contacte al administrador`,
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
 
         // TODO: habilitar rol de administrador para que pueda borrar ciclosescolares 
         // if ( cicloescolarUserId.toString() !== uid.toString() ){
         // if ( cicloescolar.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Cicloescolar Delete] El cicloescolar solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const cicloescolarEliminado = await CicloEscolar.findByIdAndDelete( cicloescolarId );
         
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
 
     var sortBy = req.query.sort || 'nombre';
     sortBy = String(sortBy);
    //  console.log("sortBy: ", sortBy);
 
    //  console.log("buscando ciclosescolares: ", regex );
 
     try{
         CicloEscolar.find({}, "nombre fechaInicio fechaFin")
                .or([
                     { nombre: regex }
                     ])
         .sort(sortBy)
         // .skip(desde)
         // .limit(pagesz)
         .exec((err, ciclosescolares) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando ciclos escolares",
               errors: err
             });
           }
           CicloEscolar.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               ciclosescolares: ciclosescolares,
               found: Object.keys(ciclosescolares).length,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Ciclos escolares get] Hubo un error, contacte al administrador`,
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