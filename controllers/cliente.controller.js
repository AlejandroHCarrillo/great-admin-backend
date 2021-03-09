/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de clientes
 */
const { response } = require('express');
PAGESIZE = require("../config/config").PAGESIZE;
const Cliente = require('../models/cliente.model');

const getClientById = async(req, res = response ) => {
    const clienteId = req.params.id;
    try{
        const cliente = await Cliente.findById( clienteId );

        if (!cliente) {
            return res.status(404).json({
                ok:false,
                msg: '[Cliente get] El cliente no existe'
            })            
        }

        res.status(200).json({ 
            ok: true,
            cliente
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Clientes get] Hubo un error, contacte al administrador`,
        });
    }
}

 const getClients = async(req, res = response ) => {
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
        Cliente.find({}, "nombre apaterno amaterno rfc activo email")
        .sort(sortBy)
        .skip(desde)
        .limit(pagesz)
        .exec((err, clientes) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando clientes",
              errors: err
            });
          }
          Cliente.countDocuments({}, (err, conteo) => {
            res.status(200).json({
              ok: true,
              clientes: clientes,
              total: conteo
            });
          });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Clientes get] Hubo un error, contacte al administrador`,
        });
    }
}
 
 const createClient = async(req, res = response ) => { 
     try{
         cliente = new Cliente(req.body);
  
         await cliente.save();
         
         res.status(201).json({ 
             ok: true,
             msg: `Cliente ${ cliente.name } ha sido registrado con exito`,
             id: cliente.id,
             name: cliente.name
         });
 
     } catch( error ){
         console.log(error);
         res.status(500).json({
             ok: false,
             msg: 'Error, por favor contacte a su admistrador'
         })
     }
 };

 const updateClient = async(req, res = response ) => {
    // console.log("Actualizando cliente: ", req );
    const clienteId = req.params.id;
    const uid = req.uid;

    try{
        const cliente = await Cliente.findById( clienteId );

        if (!cliente){
            return res.status(404).json({
                ok:false,
                msg: '[Cliente Update] El cliente no se pudo actualizar por que no existe'
            });
        }

        // TODO: habilitar rol de administrador para que pueda borrar clientes 
        // if ( clienteUserId.toString() !== uid.toString() ){
        // if ( cliente.user.toString() !== uid ){
        //     return res.status(401).json({
        //         ok:false,
        //         msg: '[Cliente Delete] El cliente solo puede ser eliminado por el propietario o el administrador'                
        //     })            
        // }
        
        const nuevoCliente = {
            ...req.body,
            user: uid
        }
        const clienteActualizado = await Cliente.findByIdAndUpdate(clienteId, nuevoCliente, { new: true } );

        // console.log( clienteActualizado );
        return res.status(200).json({ 
            ok: true,
            cliente: clienteActualizado
        });

    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cliente Update] Hubo un error, contacte al administrador`,
        });
    }
}
 

 const deleteClient = async(req, res = response ) => {
    // console.log("Eliminando cliente: ", req );
    const clienteId = req.params.id;
    const uid = req.uid;

    try{
        const cliente = await Cliente.findById( clienteId );

        if (!cliente){
            return res.status(404).json({
                ok:false,
                msg: '[Cliente Delete] El cliente no se pudo eliminar, por que no existe'
            })            
        }

        // TODO: habilitar rol de administrador para que pueda borrar clientes 
        // if ( clienteUserId.toString() !== uid.toString() ){
        // if ( cliente.user.toString() !== uid ){
        //     return res.status(401).json({
        //         ok:false,
        //         msg: '[Cliente Delete] El cliente solo puede ser eliminado por el propietario o el administrador'                
        //     })            
        // }
        
        const clienteEliminado = await Cliente.findByIdAndDelete( clienteId  );
        
        return res.status(200).json({ 
            ok: true,
            cliente: clienteEliminado
        });

    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cliente Delete] Hubo un error, contacte al administrador`,
        });

    }
}

const findClients = async (req, res = response) => {
    var busqueda = req.params.buscar;
    var regex = new RegExp(busqueda, "i");

    var desde = req.query.desde || 0;
    desde = Number(desde);
    console.log("desde: ", desde);

    var pagesz = req.query.records || PAGESIZE;
    pagesz = Number(pagesz);
    console.log("pagesz: ", pagesz);

    var sortBy = req.query.sort || 'apaterno';
    sortBy = String(sortBy);
    console.log("sortBy: ", sortBy);

    console.log("buscando clientes: ", regex );

    try{
        Cliente.find({}, "nombre apaterno amaterno rfc activo email")
               .or([
                    { nombre: regex },
                    { apaterno: regex },
                    { amaterno: regex },
                    { email: regex }
                    ])
        // .sort(sortBy)
        // .skip(desde)
        // .limit(pagesz)
        .exec((err, clientes) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando clientes",
              errors: err
            });
          }
          Cliente.countDocuments({}, (err, conteo) => {
            res.status(200).json({
              ok: true,
              clientes: clientes,
              found: Object.keys(clientes).length,
              total: conteo
            });
          });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Clientes get] Hubo un error, contacte al administrador`,
        });
    }
    // try{

    //   Cliente.find({}, "nombre apaterno amaterno rfc activo")
    //     .or([
    //       { nombre: regex },
    //       { apaterno: regex },
    //       { amaterno: regex },
    //       { email: regex }
    //     ])
    //     .exec((err, data) => {
    //       if (err) {
    //         reject('[Cliente find] Error al cargar los clientes', err);
    //       } else {
    //         resolve(data);
    //       }
    //     });
    // } catch ( error ){
    //     console.log(error);
    //     return res.status(500).json({ 
    //         ok: false,
    //         msg: `[Cliente find] Hubo un error, contacte al administrador`,
    //     });

    // }
}
 
module.exports = {
    getClientById,    
    getClients,
    findClients,
    createClient,
    updateClient,
    deleteClient
 };