/**
 * Este controlador regresa las respuestas a las rutas solicitadas para los roles
 */

const { response } = require('express');
PAGESIZE = require("../config/config").PAGESIZE;
const Role = require('../models/auth.role.model');
const Pantalla = require('../models/auth.pantalla.model');

const getRoleById = async(req, res = response ) => {
    const roleId = req.params.id;
    console.log("Get Rol:", req.params.id);
    try{
        const role = await Role.findById( roleId, "nombre activo" );
        const pantallas = await Pantalla.find({ activo: true }, "clave nombre descripcion");

        if (!role) {
            return res.status(404).json({
                ok:false,
                msg: '[role get] El rol no existe'
            })            
        }
 
         res.status(200).json({ 
             ok: true,
             rol: role,
             pantallas
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Roles get] Hubo un error, contacte al administrador`,
         });
     }
 }
 
const getRoles = async(req, res = response ) => {
    console.log("getRoles...");

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
        Role.find({}, "nombre clave descripcion activo")
        .sort(sortBy)
        .skip(desde)
        .limit(pagesz)
        .exec((err, roles) => {
        if (err) {
            return res.status(500).json({
            ok: false,
            mensaje: "Error cargando roles",
            errors: err
            });
        }
    //    console.log("showActivos: ", showActivos, roles);

        Role.countDocuments({}, (err, conteo) => {
            res.status(200).json({
            ok: true,
            roles: roles,
            total: conteo
            });
        });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Roles get] Hubo un error, contacte al administrador`,
        });
    }
}
  
const createRole = async(req, res = response ) => { 
    // console.log("Creando Role:", req.body );
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
    console.log("uid", uid);
    try{
        role = new Role(req.body);
        role.fechaalta = new Date();
        role.usuarioalta = uid;
        role.fechaactualizacion = new Date();
        role.usuarioactualizacion = uid;

        await role.save();
          
        res.status(201).json({ 
            ok: true,
            msg: `El Rol ${ role.nombre } ha sido greado con exito`,
            id: role.id,
            nombre: role.nombre,
            clave: role.clave,
            descripcion: role.descripcion
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
 
  const updateRole = async(req, res = response ) => {
    //  console.log("Actualizando role: ", req );
     const roleId = req.params.id;
     const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
 
     try{
         const role = await Role.findById( roleId );
 
         if (!role){
             return res.status(404).json({
                 ok:false,
                 msg: '[rol Update] El rol no se pudo actualizar por que no existe'
             });
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar roles 
         // if ( roleUserId.toString() !== uid.toString() ){
         // if ( role.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Role Delete] El role solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const nuevoRole = {
             ...req.body,
             fechaactualizacion : new Date(),
             usuarioactualizacion : uid
         }
         const roleActualizado = await Role.findByIdAndUpdate(roleId, nuevoRole, { new: true } );
 
         // console.log( roleActualizado );
         return res.status(200).json({ 
             ok: true,
             role: roleActualizado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[rol Update] Hubo un error, contacte al administrador`,
         });
     }
}
  
const deleteRole = async(req, res = response ) => {
     // console.log("Eliminando role: ", req );
     const roleId = req.params.id;
     const uid = req.uid;
 
     try{
         const role = await Role.findById( roleId );
 
         if (!role){
             return res.status(404).json({
                 ok:false,
                 msg: '[Role Delete] El role no se pudo eliminar, por que no existe'
             })            
         }
 
         // TODO: habilitar rol de administrador para que pueda borrar roles 
         // if ( roleUserId.toString() !== uid.toString() ){
         // if ( role.user.toString() !== uid ){
         //     return res.status(401).json({
         //         ok:false,
         //         msg: '[Role Delete] El role solo puede ser eliminado por el propietario o el administrador'                
         //     })            
         // }
         
         const roleEliminado = await Role.findByIdAndDelete( roleId );
         
         return res.status(200).json({ 
             ok: true,
             role: roleEliminado
         });
 
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Role Delete] Hubo un error, contacte al administrador`,
         });
 
     }
}
 
const findRoles = async (req, res = response) => {
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
 
    //  console.log("buscando roles: ", regex );
 
     try{
         Role.find({}, "nombre clave descripcion activo")
                .or([
                     { nombre: regex }
                     ])
         .sort(sortBy)
         // .skip(desde)
         // .limit(pagesz)
         .exec((err, roles) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando roles",
               errors: err
             });
           }
           Role.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               roles: roles,
               found: Object.keys(roles).length,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Roles get] Hubo un error, contacte al administrador`,
         });
     }

 }
  
 module.exports = {
    getRoleById, 
    getRoles,
    findRoles,
    createRole,
    updateRole,
    deleteRole
  };