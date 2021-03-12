/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de productos
 */
 const { response } = require('express');
 PAGESIZE = require("../config/config").PAGESIZE;
 const Productos = require('../models/producto.model');
 
 const getProductById = async(req, res = response ) => {
    const productoId = req.params.id;
    try{
        const producto = await Productos.findById( productoId );
 
        if (!producto) {
            return res.status(404).json({
                 ok:false,
                 msg: '[Products get] El usuario no existe'
            });
        }
 
        res.status(200).json({ 
            ok: true,
            producto: producto
        });
         
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
             ok: false,
             msg: `[Productss get] Hubo un error, contacte al administrador`,
             error
        });
     }
 }
 
const getProducts = async(req, res = response ) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    // console.log("desde: ", desde);
 
    var pagesz = req.query.records || PAGESIZE;
    pagesz = Number(pagesz);
    // console.log("pagesz: ", pagesz);
 
    var sortBy = req.query.sort || 'apaterno';
    sortBy = String(sortBy);
    // console.log("sortBy: ", sortBy);
 
    try{
        Productos.find({}, "nombre code descripcion img activo")
        .sort(sortBy)
        .skip(desde)
        .limit(pagesz)
        .exec((errors, productos) => {
            if (errors) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando productos",
                    errors: errors
                });
            }
            Productos.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                    ok: true,
                    productos: productos,
                    total: conteo
                    });
            });
         });
         
     } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Producto get] Hubo un error, contacte al administrador`,
            error
        });
     }
 }
  
  const createProduct = async(req, res = response ) => {
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";
    
    console.log( "uid: ", uid );
    try{
        let producto = new Productos(req.body);

        producto.fechaalta = new Date();
        producto.usuarioalta = uid;
        producto.fechaactualizacion = new Date();
        producto.usuarioactualizacion = uid;

        await producto.save();
        
        res.status(201).json({ 
            ok: true,
            msg: `El producto ${ producto.nombre } ha sido registrado con exito`,
            id: producto.id,
            nombre: producto.nombre
        });

    } catch( error ){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: '[Producto Create] Error, por favor contacte a su admistrador',
            error
        })
    }
  };
 
  const updateProduct = async(req, res = response ) => {
    // console.log("Actualizando user: ", req );
    const productoId = req.params.id;
    const uid = req.uid || "TODO: UPDATE UID NO ESTABLECIDA!!!";
 
     try{
        const producto = await Productos.findById( productoId );

        if (!producto){
            return res.status(404).json({
                ok:false,
                msg: '[Producto Update] El user no se pudo actualizar por que no existe'
            });
        }

        // TODO: habilitar rol de administrador para que pueda borrar productos 
        // if ( userProductsId.toString() !== uid.toString() ){
        // if ( user.user.toString() !== uid ){
        //     return res.status(401).json({
        //         ok:false,
        //         msg: '[Products Delete] El user solo puede ser eliminado por el propietario o el administrador'                
        //     })            
        // }
        
        const nuevoProducto = {
            ...req.body,
            fechaactualizacion: new Date(),
            usuarioactualizacion: uid
        }
        
        const productoActualizado = await Productos.findByIdAndUpdate(productoId, nuevoProducto, { new: true } );

        // console.log( userActualizado );
        return res.status(200).json({ 
            ok: true,
            user: productoActualizado
        });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Producto Update] Hubo un error, contacte al administrador`,
             error
         });
     }
 }
   
const deleteProduct = async(req, res = response ) => {
     // console.log("Eliminando user: ", req );
     const productoId = req.params.id;
     const uid = req.uid;
 
     try{
         const producto = await Productos.findById( productoId );
 
         if (!producto){
             return res.status(404).json({
                 ok:false,
                 msg: '[Producto Delete] El user no se pudo eliminar, por que no existe'
             })            
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar productos 
         // if ( userProductsId.toString() !== uid.toString() ){
         // if ( user.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Products Delete] El user solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const productoEliminado = await Productos.findByIdAndDelete( productoId );
         
         return res.status(200).json({ 
             ok: true,
             user: productoEliminado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Producto Delete] Hubo un error, contacte al administrador`,
             error
         });
 
     }
 }
 
 const findProducts = async (req, res = response) => {
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
 
    //  console.log("buscando productos: ", regex );
 
    try{
        Productos.find({}, "nombre code descripcion img activo")
                .or([
                    { nombre: regex },
                    { code: regex },
                    { descripcion: regex }
                    ])
        .sort(sortBy)
        //  .skip(desde)
        //  .limit(pagesz)
        .exec((error, productos) => {
            if (error) {
                return res.status(500).json({
                            ok: false,
                            mensaje: "Error cargando productos",
                            errors: error
                            });
           }
           Productos.countDocuments({}, (error, conteo) => {
             res.status(200).json({
               ok: true,
               productos: productos,
               found: Object.keys(productos).length,
               total: conteo,
               error
             });
           });
         });
         
    } catch ( error ) {
        console.log(error);
            return res.status(500).json({ 
                ok: false,
                msg: `[Producto get] Hubo un error, contacte al administrador`,
                error
            });
    }
 }
  
 module.exports = {
     getProductById,    
     getProducts,
     findProducts,
     createProduct,
     updateProduct,
     deleteProduct
  };