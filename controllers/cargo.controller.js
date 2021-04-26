/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de cargos
 */
const { ObjectId } = require('bson');
const { response } = require('express');
PAGESIZE = require("../config/config").PAGESIZE;
const Cargo = require('../models/cargo.model');
 
const getChargeById = async(req, res = response ) => {
    const cargoId = req.params.id;
    try{
        const cargo = await Cargo.findById( cargoId );

        if (!cargo) {
            return res.status(404).json({
                ok:false,
                msg: '[Cargo get] El cargo no existe'
            })            
        }

        res.status(200).json({ 
            ok: true,
            cargo
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cargos get] Hubo un error, contacte al administrador`,
        });
    }
}
 
const getCharges = async(req, res = response ) => {
     var desde = req.query.desde || 0;
     desde = Number(desde);
     // console.log("desde: ", desde);
 
     var pagesz = req.query.records || PAGESIZE;
     pagesz = Number(pagesz);
     // console.log("pagesz: ", pagesz);
 
     var sortBy = req.query.sort || 'fechavencimiento';
     sortBy = String(sortBy);
    //  console.log("sortBy: ", sortBy); 
     try{
         Cargo.find({}, "alumno producto monto concepto montopagado fechavencimiento estatus")
         .populate("alumno", "nombre apaterno amaterno grado grupo matricula id ")
         .sort(sortBy)
         .skip(desde)
         .limit(pagesz)
         .exec((err, cargos) => {
           if (err) {
             return res.status(500).json({
               ok: false,
               mensaje: "Error cargando cargos",
               errors: err
             });
           }
           Cargo.countDocuments({}, (err, conteo) => {
             res.status(200).json({
               ok: true,
               cargos: cargos,
               found: cargos.length,
               total: conteo
             });
           });
         });
         
     } catch ( error ){
         console.log(error);
         return res.status(500).json({ 
             ok: false,
             msg: `[Cargos get] Hubo un error, contacte al administrador`,
         });
     }
}

const getChargesReport = async (req, res = response) => {
    console.log("getChargesReport...");
    var strYear = req.params.year;

    try{

        var objKeyGroup = { $substr: ['$fechavencimiento', 0, 7] };
        var objMatch = { fechavencimiento: {$gte: new Date(`${strYear}-01-01T00:00:00.0Z`), $lt: new Date(`${strYear}-12-31T23:59:59.9Z`)} };

        Cargo.aggregate([
            {   $match : objMatch  },
            {   $group: { _id: objKeyGroup ,
                          count: { $sum: 1 },
                          montototal: { $sum: "$monto" }
                }
            },
            {   $sort : { _id: 1 } }
        ])
        .exec((err, reporte) => {
            if (err) {
                console.log("Error: ", err);
                return res.status(500).json({
                ok: false,
                mensaje: "Error cargando inscripciones",
                errors: err
                });
            }
            // console.log("Entro aqui: 1", reporte);

            let totalcount = 0;
            let totalamount = 0;
            reporte.forEach(element => {
                totalcount += element.count;
                totalamount += element.montototal;
            });

            res.status(200).json({
                ok: true,
                year: strYear,
                reporte,
                totalcount: totalcount,
                totalamount
            });
            
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cargos Report  get] Hubo un error, contacte al administrador`,
            error
        });
    }

}


const getChargesByAlumn = async(req, res = response ) => {
    var sortBy = req.query.sort || 'fechavencimiento';
    sortBy = String(sortBy);
   //  console.log("sortBy: ", sortBy); 
   const alumnoId = req.params.id;
   const uid = req.uid;
   console.log("alumnoId: ", alumnoId); 
   
    try{
        Cargo.find({}, "alumno producto monto concepto montopagado fechavencimiento estatus tipocargo ")
        .or([ { alumno: new ObjectId(alumnoId)  } ])
        // .populate("alumno", "nombre apaterno amaterno grado grupo matricula id ")
        .sort(sortBy)
        .exec((err, cargos) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error cargando cargos",
              errors: err
            });
          }
          Cargo.countDocuments({}, (err, conteo) => {
            res.status(200).json({
              ok: true,
            //   alumno,
              cargos: cargos,
              total: conteo
            });
          });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cargos get] Hubo un error, contacte al administrador`,
        });
    }
}

const createCharge = async(req, res = response ) => { 
    console.log("Creando Cargo:");
    console.log("Actualizando cargo: ", req.body );
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
    console.log("uid", uid);
    try{
        cargo = new Cargo(req.body);
        cargo.fechaalta = new Date();
        cargo.usuarioalta = uid;
        cargo.fechaactualizacion = new Date();
        cargo.usuarioactualizacion = uid;

        await cargo.save();
          
        res.status(201).json({ 
            ok: true,
            msg: `Cargo ${ cargo.concepto } ha sido registrado con exito`,
            id: cargo.id,
            concepto: cargo.concepto
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

const createCharges = async(req, res = response ) => { 
    let cargos = req.body;
    console.log("Creando Cargos:", cargos );

    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;
    console.log("uid", uid);

    try{
        cargos.forEach(async (charge) => {
            cargo = new Cargo(charge);
            // console.log("Creando cargo:", cargo );

            if(!cargo._id && cargo.id ) { cargo._id = cargo.id }
            
            cargo.fechaalta = new Date();
            cargo.usuarioalta = uid;
            cargo.fechaactualizacion = new Date();
            cargo.usuarioactualizacion = uid; 

            await cargo.save();
        });
          
        res.status(201).json({ 
            ok: true,
            msg: `Los cargos ( ${ cargos.length } ) han sido registrados con exito`
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
 
const updateCharge = async(req, res = response ) => {
    console.log("Actualizando cargo: ", req );
    const cargoId = req.params.id;
    const uid = req.uid || "TODO: UID NO ESTABLECIDA!!!";;

    try{
        const cargo = await Cargo.findById( cargoId );

        if (!cargo){
            return res.status(404).json({
                ok:false,
                msg: '[Cargo Update] El cargo no se pudo actualizar por que no existe'
            });
        }

        // TODO: habilitar rol de administrador para que pueda borrar cargos 
        // if ( cargoUserId.toString() !== uid.toString() ){
        // if ( cargo.user.toString() !== uid ){
        //     return res.status(401).json({
        //         ok:false,
        //         msg: '[Cargo Delete] El cargo solo puede ser eliminado por el propietario o el administrador'                
        //     })            
        // }
        
        const nuevoCargo = {
            ...req.body,
            fechaactualizacion : new Date(),
            usuarioactualizacion : uid
        }
        const cargoActualizado = await Cargo.findByIdAndUpdate(cargoId, nuevoCargo, { new: true } );

        // console.log( cargoActualizado );
        return res.status(200).json({ 
            ok: true,
            cargo: cargoActualizado
        });

    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cargo Update] Hubo un error, contacte al administrador`,
        });
    }
}
  
const deleteCharge = async(req, res = response ) => {
    // console.log("Eliminando cargo: ", req );
    const cargoId = req.params.id;
    const uid = req.uid;

    try{
        const cargo = await Cargo.findById( cargoId );

        if (!cargo){
            return res.status(404).json({
                ok:false,
                msg: '[Cargo Delete] El cargo no se pudo eliminar, por que no existe'
            })            
        }

        // TODO: habilitar rol de administrador para que pueda borrar cargos 
        // if ( cargoUserId.toString() !== uid.toString() ){
        // if ( cargo.user.toString() !== uid ){
        //     return res.status(401).json({
        //         ok:false,
        //         msg: '[Cargo Delete] El cargo solo puede ser eliminado por el propietario o el administrador'                
        //     })            
        // }
        
        const cargoEliminado = await Cargo.findByIdAndDelete( cargoId  );
        
        return res.status(200).json({ 
            ok: true,
            cargo: cargoEliminado
        });

    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cargo Delete] Hubo un error, contacte al administrador`,
        });

    }
}
 
const findCharges = async (req, res = response) => {
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

    var sortBy = req.query.sort || 'fechavencimiento';
    sortBy = String(sortBy);
//  console.log("sortBy: ", sortBy);

//  console.log("buscando cargos: ", regex );

    try{
        Cargo.find({}, "alumno producto monto concepto montopagado fechavencimiento estatus tipocargo")
            .or([
                    { alumno: o_id },
                    { producto: o_id },
                ])
            .populate('producto', 'id code nombre tasaIVA precio')
            .sort(sortBy)
        //     .skip(desde)
        //     .limit(pagesz)
        .exec((err, cargos) => {
        if (err) {
            return res.status(500).json({
            ok: false,
            mensaje: "Error cargando cargos",
            errors: err
            });
        }
        Cargo.countDocuments({}, (err, conteo) => {
            res.status(200).json({
            ok: true,
            cargos: cargos,
            found: Object.keys(cargos).length,
            total: conteo
            });
        });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Cargos get] Hubo un error, contacte al administrador`,
            error
        });
    }

}
  
module.exports = {
    getChargeById, 
    getCharges,
    getChargesReport,
    getChargesByAlumn,
    findCharges,
    createCharge,
    createCharges,
    updateCharge,
    deleteCharge
};