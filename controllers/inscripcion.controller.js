/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de inscripciones
 */
const { ObjectId } = require('bson');
const { response } = require('express');
PAGESIZE = require("../config/config").PAGESIZE;
const Inscripcion = require('../models/inscripcion.model');
 
const getInscriptionById = async(req, res = response ) => {
     const inscripcionId = req.params.id;
     try{
         const inscripcion = await Inscripcion.findById( inscripcionId );
 
         if (!inscripcion) {
             return res.status(404).json({
                 ok:false,
                 msg: '[Inscripcion GET] El inscripcion no existe'
             })            
         }
 
         res.status(200).json({ 
             ok: true,
             inscripcion
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Inscripciones GET] Hubo un error, contacte al administrador`,
         });
     }
}
 
const getInscriptions = async(req, res = response ) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    // console.log("desde: ", desde);

    var pagesz = req.query.records || PAGESIZE;
    pagesz = Number(pagesz);
    // console.log("pagesz: ", pagesz);

    var sortBy = req.query.sort || 'alumno';
    sortBy = String(sortBy);
//  console.log("sortBy: ", sortBy); 
    try{
        Inscripcion.find({}, "alumno cicloescolar estatus")
        .populate('alumno', 'nombre apaterno amaterno nivel grado grupo matricula email img')
        .populate("cicloescolar", "nombre fechaInicio fechaFin")
        .sort(sortBy)
        .skip(desde)
        .limit(pagesz)
        .exec((err, inscripciones) => {
        if (err) {
            console.log("Error: ", err);
            return res.status(500).json({
            ok: false,
            mensaje: "Error cargando inscripciones",
            errors: err
            });
        }
        Inscripcion.countDocuments({}, (err, conteo) => {
            res.status(200).json({
            ok: true,
            inscripciones: inscripciones,
            total: conteo
            });
        });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Inscripciones GET] Hubo un error, contacte al administrador`,
        });
    }
}

const createInscription = async(req, res = response ) => { 
// console.log("Creando Inscripcion:", req.body );
const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
// console.log("uid", uid);
try{
    inscripcion = new Inscripcion(req.body);
    inscripcion.fechaalta = new Date();
    inscripcion.usuarioalta = uid;
    inscripcion.fechaactualizacion = new Date();
    inscripcion.usuarioactualizacion = uid;

    await inscripcion.save();
        
    res.status(201).json({ 
        ok: true,
        msg: `Inscripcion ${ inscripcion.name } ha sido registrado con exito`,
        id: inscripcion.id,
        name: inscripcion.name
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

const updateInscription = async(req, res = response ) => {
    console.log("Actualizando inscripcion: ", req );
    const inscripcionId = req.params.id;
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;

    try{
        const inscripcion = await Inscripcion.findById( inscripcionId );

        if (!inscripcion){
            return res.status(404).json({
                ok:false,
                msg: '[Inscripcion Update] El inscripcion no se pudo actualizar por que no existe'
            });
        }

        // TODO: habilitar rol de administrador para que pueda borrar inscripciones 
        // if ( inscripcionUserId.toString() !== uid.toString() ){
        // if ( inscripcion.user.toString() !== uid ){
        //     return res.status(401).json({
        //         ok:false,
        //         msg: '[Inscripcion Delete] El inscripcion solo puede ser eliminado por el propietario o el administrador'                
        //     })            
        // }
        
        const nuevoInscripcion = {
            ...req.body,
            fechaactualizacion : new Date(),
            usuarioactualizacion : uid
        }
        const inscripcionActualizado = await Inscripcion.findByIdAndUpdate(inscripcionId, nuevoInscripcion, { new: true } );

        // console.log( inscripcionActualizado );
        return res.status(200).json({ 
            ok: true,
            inscripcion: inscripcionActualizado
        });

    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Inscripcion Update] Hubo un error, contacte al administrador`,
        });
    }
}

const deleteInscription = async(req, res = response ) => {
    // console.log("Eliminando inscripcion: ", req );
    const inscripcionId = req.params.id;
    const uid = req.uid;

    try{
        const inscripcion = await Inscripcion.findById( inscripcionId );

        if (!inscripcion){
            return res.status(404).json({
                ok:false,
                msg: '[Inscripcion Delete] El inscripcion no se pudo eliminar, por que no existe'
            })            
        }

        // TODO: habilitar rol de administrador para que pueda borrar inscripciones 
        // if ( inscripcionUserId.toString() !== uid.toString() ){
        // if ( inscripcion.user.toString() !== uid ){
        //     return res.status(401).json({
        //         ok:false,
        //         msg: '[Inscripcion Delete] El inscripcion solo puede ser eliminado por el propietario o el administrador'                
        //     })            
        // }
        
        const inscripcionEliminado = await Inscripcion.findByIdAndDelete( inscripcionId  );
        
        return res.status(200).json({ 
            ok: true,
            inscripcion: inscripcionEliminado
        });

    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Inscripcion Delete] Hubo un error, contacte al administrador`,
        });

    }
}

const findInscriptions = async (req, res = response) => {
    var busqueda = req.params.buscar;
//  console.log("busqueda: ", busqueda);
    var o_id = new ObjectId(busqueda);
//  console.log("o_id: ", o_id);

    var regex = new RegExp(busqueda, "i");

    var desde = req.query.desde || 0;
    desde = Number(desde);
//  console.log("desde: ", desde);

    var pagesz = req.query.records || PAGESIZE;
    pagesz = Number(pagesz);
//  console.log("pagesz: ", pagesz);

    var sortBy = req.query.sort || 'cicloescolar';
    sortBy = String(sortBy);
//  console.log("sortBy: ", sortBy);

//  console.log("buscando inscripciones: ", regex );

    try{
        Inscripcion.find({}, "alumno cicloescolar estatus")
            .or([
                    { alumno: o_id },
                    { cicloescolar: o_id },
                ])
            .populate('alumno', 'nombre apaterno amaterno nivel grado grupo matricula email img')
            .populate("cicloescolar", "nombre fechaInicio fechaFin")
            .sort(sortBy)
        //     .skip(desde)
        //     .limit(pagesz)
        .exec((err, inscripciones) => {
        if (err) {
            return res.status(500).json({
            ok: false,
            mensaje: "Error cargando inscripciones",
            errors: err
            });
        }
        Inscripcion.countDocuments({}, (err, conteo) => {
            res.status(200).json({
            ok: true,
            inscripciones: inscripciones,
            found: Object.keys(inscripciones).length,
            total: conteo
            });
        });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Inscripciones get] Hubo un error, contacte al administrador`,
            error
        });
    }

}

module.exports = {
    getInscriptionById, 
    getInscriptions,
    findInscriptions,
    createInscription,
    updateInscription,
    deleteInscription
};