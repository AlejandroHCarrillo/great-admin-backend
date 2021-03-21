/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de usuarios
 */
 const { response } = require('express');
 PAGESIZE = require("../config/config").PAGESIZE;
 const Users = require('../models/usuario.model');
 
 const getUserById = async(req, res = response ) => {
     const usuarioId = req.params.id;
     try{
         const usuario = await Users.findById( usuarioId );
 
         if (!usuario) {
             return res.status(404).json({
                 ok:false,
                 msg: '[User get] El user no existe'
             })            
         }
 
         res.status(200).json({ 
             ok: true,
             usuario: usuario
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Users get] Hubo un error, contacte al administrador`,
         });
     }
 }
 
  const getUsers = async(req, res = response ) => {
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
         Users.find({}, "nombre username name email role")
         .sort(sortBy)
         .skip(desde)
         .limit(pagesz)
         .exec((err, usuarios) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando usuarios",
               errors: err
             });
           }
           Users.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               usuarios: usuarios,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Users get] Hubo un error, contacte al administrador`,
         });
     }
 }
  
  const createUser = async(req, res = response ) => { 
      console.log("Creando usuario");
      const uid = req.uid || "TODO: usuario no definido";

      try{
          let usuario = new Users(req.body);

          usuario.fechaalta = new Date();
          usuario.usuarioalta = uid;
          usuario.fechaactualizacion = new Date();
          usuario.usuarioactualizacion = uid;

          await usuario.save();
          
          res.status(201).json({ 
              ok: true,
              msg: `User ${ usuario.nombre } ha sido registrado con exito`,
              id: usuario.id,
              name: usuario.nombre
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
 
  const updateUser = async(req, res = response ) => {
     // console.log("Actualizando user: ", req );
     const usuarioId = req.params.id;
     const uid = req.uid || "TODO: usuario no definido";
 
     try{
         const usuario = await Users.findById( usuarioId );
 
         if (!usuario){
             return res.status(404).json({
                 ok:false,
                 msg: '[User Update] El user no se pudo actualizar por que no existe'
             });
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar usuarios 
         // if ( userUserId.toString() !== uid.toString() ){
         // if ( user.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[User Delete] El user solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const nuevoUsuario = {
             ...req.body,
             fechaactualizacion : new Date(),
             usuarioactualizacion : uid
         }
         const usuarioActualizado = await Users.findByIdAndUpdate(usuarioId, nuevoUsuario, { new: true } );
 
         // console.log( userActualizado );
         return res.status(200).json({ 
             ok: true,
             user: usuarioActualizado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[User Update] Hubo un error, contacte al administrador`,
         });
     }
 }
   
const deleteUser = async(req, res = response ) => {
     // console.log("Eliminando user: ", req );
     const usuarioId = req.params.id;
 
     try{
         const usuario = await Users.findById( usuarioId );
 
         if (!usuario){
             return res.status(404).json({
                 ok:false,
                 msg: '[User Delete] El user no se pudo eliminar, por que no existe'
             })            
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar usuarios 
         // if ( userUserId.toString() !== uid.toString() ){
         // if ( user.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[User Delete] El user solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const usuarioEliminado = await Users.findByIdAndDelete( usuarioId );
         
         return res.status(200).json({ 
             ok: true,
             user: usuarioEliminado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[User Delete] Hubo un error, contacte al administrador`,
         });
 
     }
 }
 
 const findUsers = async (req, res = response) => {
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
 
    //  console.log("buscando usuarios: ", regex );
 
     try{
         Users.find({}, "nombre username name email role")
                .or([
                     { nombre: regex },
                     { email: regex }
                     ])
         // .sort(sortBy)
         // .skip(desde)
         // .limit(pagesz)
         .exec((err, usuarios) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando usuarios",
               errors: err
             });
           }
           Users.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               usuarios: usuarios,
               found: Object.keys(usuarios).length,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Users get] Hubo un error, contacte al administrador`,
         });
     }
 }
  
 module.exports = {
     getUserById,    
     getUsers,
     findUsers,
     createUser,
     updateUser,
     deleteUser
  };