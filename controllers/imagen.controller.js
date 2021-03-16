/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de imagenes
 */
 const { response } = require('express');
 PAGESIZE = require("../config/config").PAGESIZE;
 const Imagenes = require('../models/imagen.model');
 
 const getImageById = async(req, res = response ) => {
    const imagenId = req.params.id;
    try{
        const imagen = await Imagenes.findById( imagenId );
 
        if (!imagen) {
            return res.status(404).json({
                 ok:false,
                 msg: '[Images get] La imagen no existe'
            });
        }
 
        res.status(200).json({ 
            ok: true,
            imagen: imagen
        });
         
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
             ok: false,
             msg: `[Imagess get] Hubo un error, contacte al administrador`,
             error
        });
     }
 }
 
const getImages = async(req, res = response ) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    // console.log("desde: ", desde);
 
    var pagesz = req.query.records || PAGESIZE;
    pagesz = Number(pagesz);
    // console.log("pagesz: ", pagesz);
 
    var sortBy = req.query.sort || 'tipoCatalogo';
    sortBy = String(sortBy);
    // console.log("sortBy: ", sortBy);
 
    try{
        Imagenes.find({}, "tipoCatalogo titulo url")
        .sort(sortBy)
        .skip(desde)
        .limit(pagesz)
        .exec((errors, imagenes) => {
            if (errors) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando imagenes",
                    errors: errors
                });
            }
            Imagenes.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                    ok: true,
                    imagenes: imagenes,
                    total: conteo
                    });
            });
         });
         
     } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Imagen get] Hubo un error, contacte al administrador`,
            error
        });
     }
 }
  
  const createImage = async(req, res = response ) => {
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";
    
    console.log( "uid: ", uid );
    try{
        let imagen = new Imagenes(req.body);

        imagen.fechaalta = new Date();
        imagen.usuarioalta = uid;
        imagen.fechaactualizacion = new Date();
        imagen.usuarioactualizacion = uid;

        await imagen.save();
        
        res.status(201).json({ 
            ok: true,
            msg: `El imagen ${ imagen.title || imagen._id } ha sido registrado con exito`,
            id: imagen.id,
            tipoCatalogo: imagen.tipoCatalogo
        });

    } catch( error ){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: '[Imagen Create] Error, por favor contacte a su admistrador',
            error
        })
    }
  };
 
  const updateImage = async(req, res = response ) => {
    // console.log("Actualizando image: ", req );
    const imagenId = req.params.id;
    const uid = req.uid || "TODO: UPDATE UID NO ESTABLECIDA!!!";
 
     try{
        const imagen = await Imagenes.findById( imagenId );

        if (!imagen){
            return res.status(404).json({
                ok:false,
                msg: '[Imagen Update] El image no se pudo actualizar por que no existe'
            });
        }

        // TODO: habilitar rol de administrador para que pueda borrar imagenes 
        // if ( imageImagesId.toString() !== uid.toString() ){
        // if ( image.image.toString() !== uid ){
        //     return res.status(401).json({
        //         ok:false,
        //         msg: '[Images Delete] El image solo puede ser eliminado por el propietario o el administrador'                
        //     })            
        // }
        
        const nuevoImagen = {
            ...req.body,
            fechaactualizacion: new Date(),
            usuarioactualizacion: uid
        }
        
        const imagenActualizado = await Imagenes.findByIdAndUpdate(imagenId, nuevoImagen, { new: true } );

        // console.log( imageActualizado );
        return res.status(200).json({ 
            ok: true,
            image: imagenActualizado
        });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Imagen Update] Hubo un error, contacte al administrador`,
             error
         });
     }
 }
   
const deleteImage = async(req, res = response ) => {
     // console.log("Eliminando image: ", req );
     const imagenId = req.params.id;
     const uid = req.uid;
 
     try{
         const imagen = await Imagenes.findById( imagenId );
 
         if (!imagen){
             return res.status(404).json({
                 ok:false,
                 msg: '[Imagen Delete] El image no se pudo eliminar, por que no existe'
             })            
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar imagenes 
         // if ( imageImagesId.toString() !== uid.toString() ){
         // if ( image.image.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Images Delete] El image solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const imagenEliminado = await Imagenes.findByIdAndDelete( imagenId );
         
         return res.status(200).json({ 
             ok: true,
             image: imagenEliminado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Imagen Delete] Hubo un error, contacte al administrador`,
             error
         });
 
     }
 }
 
 const findImages = async (req, res = response) => {
     var busqueda = req.params.buscar;
     var regex = new RegExp(busqueda, "i");
 
     var desde = req.query.desde || 0;
     desde = Number(desde);
    //  console.log("desde: ", desde);
 
     var pagesz = req.query.records || PAGESIZE;
     pagesz = Number(pagesz);
    //  console.log("pagesz: ", pagesz);
 
     var sortBy = req.query.sort || 'titulo';
     sortBy = String(sortBy);
    //  console.log("sortBy: ", sortBy);
 
    //  console.log("buscando imagenes: ", regex );
 
    try{
        Imagenes.find({}, "tipoCatalogo titulo url")
                .or([
                    { ownerId: regex }
                    // , { tipoCatalogo: regex },
                    // { titulo: regex },
                    // { url: regex }
                    ])
        .sort(sortBy)
        //  .skip(desde)
        //  .limit(pagesz)
        .exec((error, imagenes) => {
            if (error) {
                return res.status(500).json({
                            ok: false,
                            mensaje: "Error cargando imagenes",
                            errors: error
                            });
           }
           Imagenes.countDocuments({}, (error, conteo) => {
             res.status(200).json({
               ok: true,
               imagenes: imagenes,
               found: Object.keys(imagenes).length,
               total: conteo,
               error
             });
           });
         });
         
    } catch ( error ) {
        console.log(error);
            return res.status(500).json({ 
                ok: false,
                msg: `[Imagen get] Hubo un error, contacte al administrador`,
                error
            });
    }
 }
  
 module.exports = {
     getImageById,    
     getImages,
     findImages,
     createImage,
     updateImage,
     deleteImage
  };