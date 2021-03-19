/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de clientes
 */
const { response } = require('express');
const ClienteAlumno = require('../models/cliente.alumno.model');
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
    console.log("sortBy: ", sortBy);

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
  
         cliente.fechaalta = new Date();
         cliente.usuarioalta = uid;
         cliente.fechaactualizacion = new Date();
         cliente.usuarioactualizacion = uid;
 
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
            fechaactualizacion : new Date(),
            usuarioactualizacion : uid
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
        .sort(sortBy)
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
}

const getClientAlumns = async (req, res = response) => {
    const clienteId = req.params.id;
    try{
        ClienteAlumno.find({})
                .or([ { cliente: clienteId } ])
                .populate('alumno', 'nombre apaterno amaterno matricula url' )
        .exec((err, alumnos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando alumnos del cliente",
                    errors: err
                });
            }
            console.log(alumnos);
            res.status(200).json({
                ok: true,
                clienteid: clienteId,
                alumnos: alumnos,
                found: Object.keys(alumnos).length
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

const createClientAlumn = async (req, res = response) => {
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";

    try{
        ClienteAlumno.find({},"")
        .or([ { alumnoid: req.body.alumnoid } ])
        .exec(async (err, alumnos) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Error cargando alumnos",
                errors: err
              });
            }

            if(Object.keys(alumnos).length > 0){
                console.log("El alumno ya estaba asociado", alumnos);
                return res.status(404).json({
                    ok:false,
                    msg: '[Cliente alumno] El alumno ya esta asociado a un cliente.'
                });
            } else{                    
                let clientealumno = new ClienteAlumno(req.body);
            
                clientealumno.fechaalta = new Date();
                clientealumno.usuarioalta = uid;
                clientealumno.fechaactualizacion = new Date();
                clientealumno.usuarioactualizacion = uid;
                
                await clientealumno.save();
                
                res.status(201).json({ 
                    ok: true,
                    msg: `La relacion cliente alumno ha sido registrada con exito`,
                    clientealumnoid: clientealumno.id
                });
            }

        });
   
    } catch( error ){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, por favor contacte a su admistrador'
        })
    }

}

const deleteClientAlumn = async (req, res = response) => {
    const clienteId = req.params.id;
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";

    try{
        const relclientealumno = await ClienteAlumno.findById( clienteId );

        if (!relclientealumno){
            return res.status(404).json({
                ok:false,
                msg: '[Cliente Alumno Delete] La relacion cliente alumno no se pudo eliminar, por que no existe'
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
        
        const relClientealumnoEliminada = await ClienteAlumno.findByIdAndDelete( clienteId );
        
        return res.status(200).json({ 
            ok: true,
            clientealumnoEliminado: relClientealumnoEliminada
        });

    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cliente Alumno Delete] Hubo un error, contacte al administrador`,
        });

    }
}

module.exports = {
    getClientById,    
    getClients,
    findClients,
    createClient,
    updateClient,
    deleteClient,
    getClientAlumns,
    createClientAlumn,
    deleteClientAlumn
 };