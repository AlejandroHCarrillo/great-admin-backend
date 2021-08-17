/**
 * Este contpantallaador regresa las respuestas a las rutas solicitadas para los pantallas
 */
 const { response } = require('express');
 PAGESIZE = require("../config/config").PAGESIZE;
 const Pantalla = require('../models/auth.pantalla.model');
 
const getPantallaById = async(req, res = response ) => {
    const pantallaId = req.params.id;
    console.log("Get Pantalla:", req.params.id);
    try{
        const pantallas = await Pantalla.findById( pantallaId );

        if (!pantallas) {
            return res.status(404).json({
                ok:false,
                msg: '[pantalla get] El pantalla no existe'
            })            
        }
 
         res.status(200).json({ 
             ok: true,
             pantallas
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Pantallas get] Hubo un error, contacte al administrador`,
         });
     }
 }
 
const getPantallas = async(req, res = response ) => {
    console.log("getPantallas...");

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
        Pantalla.find({}, "nombre clave descripcion activo")
        .sort(sortBy)
        .skip(desde)
        .limit(pagesz)
        .exec((err, pantallas) => {
        if (err) {
            return res.status(500).json({
            ok: false,
            mensaje: "Error cargando pantallas",
            errors: err
            });
        }
    //    console.log("showActivos: ", showActivos, pantallas);

        Pantalla.countDocuments({}, (err, conteo) => {
            res.status(200).json({
            ok: true,
            pantallas: pantallas,
            total: conteo
            });
        });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Pantallas get] Hubo un error, contacte al administrador`,
        });
    }
}
  
const createPantalla = async(req, res = response ) => { 
    // console.log("Creando Pantalla:", req.body );
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
    console.log("uid", uid);
    try{
        pantalla = new Pantalla(req.body);
        pantalla.fechaalta = new Date();
        pantalla.usuarioalta = uid;
        pantalla.fechaactualizacion = new Date();
        pantalla.usuarioactualizacion = uid;

        await pantalla.save();
          
        res.status(201).json({ 
            ok: true,
            msg: `El Pantalla ${ pantalla.nombre } ha sido greado con exito`,
            id: pantalla.id,
            nombre: pantalla.nombre,
            clave: pantalla.clave,
            descripcion: pantalla.descripcion
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
 
  const updatePantalla = async(req, res = response ) => {
    //  console.log("Actualizando pantalla: ", req );
     const pantallaId = req.params.id;
     const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
 
     try{
         const pantalla = await Pantalla.findById( pantallaId );
 
         if (!pantalla){
             return res.status(404).json({
                 ok:false,
                 msg: '[pantalla Update] El pantalla no se pudo actualizar por que no existe'
             });
         }
 
         // TODO: habilitar pantalla de administrador para que pueda borrar pantallas 
         // if ( pantallaUserId.toString() !== uid.toString() ){
         // if ( pantalla.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Pantalla Delete] El pantalla solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const nuevoPantalla = {
             ...req.body,
             fechaactualizacion : new Date(),
             usuarioactualizacion : uid
         }
         const pantallaActualizado = await Pantalla.findByIdAndUpdate(pantallaId, nuevoPantalla, { new: true } );
 
         // console.log( pantallaActualizado );
         return res.status(200).json({ 
             ok: true,
             pantalla: pantallaActualizado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[pantalla Update] Hubo un error, contacte al administrador`,
         });
     }
}
  
const deletePantalla = async(req, res = response ) => {
     // console.log("Eliminando pantalla: ", req );
     const pantallaId = req.params.id;
     const uid = req.uid;
 
     try{
         const pantalla = await Pantalla.findById( pantallaId );
 
         if (!pantalla){
             return res.status(404).json({
                 ok:false,
                 msg: '[Pantalla Delete] El pantalla no se pudo eliminar, por que no existe'
             })            
         }
 
         // TODO: habilitar pantalla de administrador para que pueda borrar pantallas 
         // if ( pantallaUserId.toString() !== uid.toString() ){
         // if ( pantalla.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Pantalla Delete] El pantalla solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const pantallaEliminado = await Pantalla.findByIdAndDelete( pantallaId );
         
         return res.status(200).json({ 
             ok: true,
             pantalla: pantallaEliminado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Pantalla Delete] Hubo un error, contacte al administrador`,
         });
 
     }
}
 
const findPantallas = async (req, res = response) => {
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
 
    //  console.log("buscando pantallas: ", regex );
 
     try{
         Pantalla.find({}, "nombre clave descripcion activo")
                .or([
                     { nombre: regex }
                     ])
         .sort(sortBy)
         // .skip(desde)
         // .limit(pagesz)
         .exec((err, pantallas) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando pantallas",
               errors: err
             });
           }
           Pantalla.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               pantallas: pantallas,
               found: Object.keys(pantallas).length,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Pantallas get] Hubo un error, contacte al administrador`,
         });
     }

 }
  
 module.exports = {
    getPantallaById, 
    getPantallas,
    findPantallas,
    createPantalla,
    updatePantalla,
    deletePantalla
  };