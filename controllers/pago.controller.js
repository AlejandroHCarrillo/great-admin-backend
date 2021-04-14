/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de pagos
 */
 const { response } = require('express');
 PAGESIZE = require("../config/config").PAGESIZE;
 const Pago = require('../models/pago.model');
 
 const getPagoById = async(req, res = response ) => {
     const pagoId = req.params.id;
     try{
         const pago = await Pago.findById( pagoId );
 
         if (!pago) {
             return res.status(404).json({
                 ok:false,
                 msg: '[Pago get] El pago no existe'
             })            
         }
 
         res.status(200).json({ 
             ok: true,
             pago
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Pagos get] Hubo un error, contacte al administrador`,
         });
     }
 }
 
  const getPagos = async(req, res = response ) => {
     var desde = req.query.desde || 0;
     desde = Number(desde);
     // console.log("desde: ", desde);
 
     var pagesz = req.query.records || PAGESIZE;
     pagesz = Number(pagesz);
     // console.log("pagesz: ", pagesz);
 
     var sortBy = req.query.sort || 'fechapago';
     sortBy = String(sortBy);
    //  console.log("sortBy: ", sortBy);
 
     try{
         Pago.find({}, "folio fechapago alumno formapago montopagado ")
         .sort(sortBy)
         .skip(desde)
         .limit(pagesz)
         .exec((err, pagos) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando pagos",
               errors: err
             });
           }
           Pago.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               pagos: pagos,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Pagos get] Hubo un error, contacte al administrador`,
         });
     }
 }
  
const createPago = async(req, res = response ) => { 
    console.log("Creando Pago:");
    console.log("Actualizando pago: ", req.body );
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
    console.log("uid", uid);
    try{

        Pago.nextCount(async (err, count) => {
            // if (!counterSchema || !IdentityCounter) throw new Error("mongoose-auto-increment has not been initialized");
            if(err){
                console.log("Error: ", err);
                return;
            }

            let pago = new Pago(req.body);
            pago.fechaalta = new Date();
            pago.usuarioalta = uid;
            pago.fechaactualizacion = new Date();
            pago.usuarioactualizacion = uid;

            await pago.save();
            
            res.status(201).json({ 
                ok: true,
                msg: `El pago de ${ pago.monto } ha sido registrado con exito`,
                pago
            });
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
 
  const updatePago = async(req, res = response ) => {
     console.log("Actualizando pago: ", req.body );
     const pagoId = req.params.id;
     const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
 
     try{
         const pago = await Pago.findById( pagoId );
 
         if (!pago){
             return res.status(404).json({
                 ok:false,
                 msg: '[Pago Update] El pago no se pudo actualizar por que no existe'
             });
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar pagos 
         // if ( pagoUserId.toString() !== uid.toString() ){
         // if ( pago.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Pago Delete] El pago solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const nuevoPago = {
             ...req.body,
             fechaactualizacion : new Date(),
             usuarioactualizacion : uid
         }
         const pagoActualizado = await Pago.findByIdAndUpdate(pagoId, nuevoPago, { new: true } );
 
         // console.log( pagoActualizado );
         return res.status(200).json({ 
             ok: true,
             pago: pagoActualizado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Pago Update] Hubo un error, contacte al administrador`,
         });
     }
 }
  
  const deletePago = async(req, res = response ) => {
     // console.log("Eliminando pago: ", req );
     const pagoId = req.params.id;
     const uid = req.uid;
 
     try{
         const pago = await Pago.findById( pagoId );
 
         if (!pago){
             return res.status(404).json({
                 ok:false,
                 msg: '[Pago Delete] El pago no se pudo eliminar, por que no existe'
             })            
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar pagos 
         // if ( pagoUserId.toString() !== uid.toString() ){
         // if ( pago.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Pago Delete] El pago solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const pagoEliminado = await Pago.findByIdAndDelete( pagoId  );
         
         return res.status(200).json({ 
             ok: true,
             pago: pagoEliminado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Pago Delete] Hubo un error, contacte al administrador`,
         });
 
     }
 }
 
 const findPagos = async (req, res = response) => { 
    const alumnoId = req.params.id;

     var busqueda = req.params.buscar;
     var regex = new RegExp(busqueda, "i");
 
     var desde = req.query.desde || 0;
     desde = Number(desde);
    //  console.log("desde: ", desde);
 
     var pagesz = req.query.records || PAGESIZE;
     pagesz = Number(pagesz);
    //  console.log("pagesz: ", pagesz);
 
     var sortBy = req.query.sort || 'fechapago';
     sortBy = String(sortBy);
    //  console.log("sortBy: ", sortBy);
 
    //  console.log("buscando pagos: ", regex );
 
     try{
         Pago.find({}, "folio fechapago alumno formapago montopagado estatus")
                .or([
                     { folio: regex },
                     { fechapago: regex },
                     { alumno: new ObjectId(alumnoId) },
                     { formapago: regex },
                     { estatus: regex }
                     ])
         .sort(sortBy)
         // .skip(desde)
         // .limit(pagesz)
         .exec((err, pagos) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando pagos",
               errors: err
             });
           }
           Pago.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               pagos: pagos,
               found: Object.keys(pagos).length,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Pagos find] Hubo un error, contacte al administrador`,
         });
     }

 }
  
 module.exports = {
     getPagoById,
     getPagos,
     findPagos,
     createPago,
     updatePago,
     deletePago
  };