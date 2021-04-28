/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de alumnos
 */
const { response } = require('express');
const { isDate } = require('../helpers/isDate');
const alumnotempModel = require('../models/alumnotemp.model');
PAGESIZE = require("../config/config").PAGESIZE;
const EstadoCuenta = require('../models/estadocuenta.model');
 
 const getAlumns = async(req, res = response ) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    // console.log("desde: ", desde);

    var pagesz = req.query.records || PAGESIZE;
    pagesz = Number(pagesz);
    // console.log("pagesz: ", pagesz);

    var sortBy = req.query.sort || 'hoja';
    sortBy = String(sortBy);
//  console.log("sortBy: ", sortBy);

    try{
        alumnotempModel.find({}, "nombre apellidos matricula nivel folio hoja")
        .sort(sortBy)
        // .skip(desde)
        // .limit(pagesz)
        .exec((err, alumnos) => {
        if (err) {
            return res.status(500).json({
            ok: false,
            mensaje: "Error cargando alumnos",
            errors: err
            });
        }
        alumnotempModel.countDocuments({}, (err, conteo) => {
            res.status(200).json({
            ok: true,
            alumnos: alumnos,
            total: conteo
            });
        });
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Alumnos get] Hubo un error, contacte al administrador`,
        });
    }
}

 const getEstadoCuentaByMatricula = async(req, res = response ) => {
     const matricula = req.params.matricula;
     console.log("getEstadoCuentaByMatricula", matricula);

     const sortBy = "fecha";
     try{
        EstadoCuenta.findOne({matricula: matricula}, "matricula nombre apellidos ")
        .exec((err, alumno) => {
            console.log("alumno: ", alumno );
            EstadoCuenta.find({}, "fecha concepto cargo abono ")
                .or([ { matricula: matricula } ])
                .sort(sortBy)
                // .skip(desde)
                // .limit(pagesz)
                .exec((err, registros) => {
                    if (err) {
                        return res.status(500).json({
                        ok: false,
                        mensaje: "Error cargando el estado de cuenta",
                        errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        alumno,
                        estadocuenta: registros,
                        found: Object.keys(registros).length,
                    });
                });

        });


        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Estado de cuenta get] Hubo un error, contacte al administrador`,
            error
        });
    }

 }

 const getEstadoCuentaReport = async (req = request, res = response) => {
     var strMatricula = req.params.matricula;
     console.log("getEstadoCuentaReport...", strMatricula);
     console.log("Query Params: ", req.query );
     let fini = req.query.fini;
     let ffin = req.query.ffin;

     console.log(fini, ffin);
     try{
        let objKeyGroup = { $substr: ['$concepto', 0, 11] };
        // var objKeyGroup = { concepto: '$concepto' };

        let objMatch = {};

        if(strMatricula === 'periodo'){ 
            objMatch = {}
        } else {
            objMatch = { matricula: strMatricula };
        }

        EstadoCuenta.aggregate([
            {   $match : objMatch  },
            {   $group: { _id: objKeyGroup ,
                          counter: { $sum: 1 },
                          totalcargos: { $sum: { $toDecimal: "$cargo" } },
                          totalabonos: { $sum: { $toDecimal: '$abono' } },
                }
            },
            {   $sort : { _id: 1 } }
        ])
        .exec((err, resumen) => {
            if (err) {
                console.log("Error: ", err);
                return res.status(500).json({
                ok: false,
                mensaje: "Error cargando resumen de pagos",
                errors: err
                });
            }

            let newReport = [];

            let sumTotalCargos = 0;
            let sumTotalAbonos = 0;
            let contadorTotal = 0;

            resumen.forEach(element => {
                console.log(parseInt(element.totalcargos));
                sumTotalCargos+= parseInt(element.totalcargos);
                sumTotalAbonos+= parseInt(element.totalabonos);
                contadorTotal+= parseInt(element.counter);

                newReport.push(
                    {...element,
                    totalcargos: parseInt(element.totalcargos),
                    totalabonos: parseInt(element.totalabonos),
                    }
                );
            });

            newReport.push( {
                _id: "Total",
                counter: contadorTotal,
                totalcargos: sumTotalCargos,
                totalabonos: sumTotalAbonos
                } );

            res.status(200).json({
                ok: true,
                resumen: newReport
                // totalcount: totalcount,
                // totalamount
            });
            
        });
        
    } catch ( error ){
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: `[Pagos Report get] Hubo un error, contacte al administrador`,
            error
        });
    }

}

const getListaEstadosCuenta = async (req = request, res = response) => {
    var strMatricula = req.params.matricula;
    console.log("getEstadosCuentaList...", strMatricula);
    console.log("Query Params: ", req.query );

    let fini = req.query.fini;
    let ffin = req.query.ffin;

    console.log( isDate(fini), isDate(ffin) );

    try{
        //    let objKeyGroup = { $substr: ['$matricula', 0, 11] };
        let objKeyGroup = '$matricula';

        //    let objMatch = { matricula: strMatricula };
        var objMatch = { 
            // matricula: "27121029", 
            fecha: { 
                    $gte: `${fini}T00:00:00.0Z`, 
                    $lte: `${ffin}T23:59:59.9Z`
                } 
        };
    
       console.log(objMatch);

       EstadoCuenta.aggregate([
           {   $match : objMatch },
           {   $group: { _id: objKeyGroup ,
                         counter: { $sum: 1 },
                         totalcargos: { $sum: { $toDecimal: "$cargo" } },
                         totalabonos: { $sum: { $toDecimal: '$abono' } },
               }
           },
           {   $sort : { _id: 1 } }
       ]).exec((err, resumen) => {
           if (err) {
               console.log("Error: ", err);
               return res.status(500).json({
               ok: false,
               mensaje: "Error cargando resumen de pagos",
               errors: err
               });
           }

           let estadosCuenta = [];

           let sumTotalCargos = 0;
           let sumTotalAbonos = 0;
           let contadorTotal = 0;

           resumen.forEach(element => {
            //    console.log(element);
            //    console.log(parseInt(element.totalcargos));
               sumTotalCargos+= parseInt(element.totalcargos);
               sumTotalAbonos+= parseInt(element.totalabonos);
               contadorTotal+= parseInt(element.counter);

               estadosCuenta.push(
                   {
                    matricula: element._id,
                    counter: element.counter,
                    totalcargos: parseInt(element.totalcargos),
                    totalabonos: parseInt(element.totalabonos),
                    saldo: parseInt(element.totalcargos) - parseInt(element.totalabonos)
                   }
               );
           });

           estadosCuenta.push( {
               _id: "Total",
               counter: contadorTotal,
               totalcargos: sumTotalCargos,
               totalabonos: sumTotalAbonos
               } );

           res.status(200).json({
               ok: true,
               estadoscuenta: estadosCuenta
               // totalcount: totalcount,
               // totalamount
           });
           
        });
       
   } catch ( error ){
       console.log(error);
       return res.status(500).json({ 
           ok: false,
           msg: `[Pagos Report get] Hubo un error, contacte al administrador`,
           error
       });
   }

}


 
 module.exports = {
    getAlumns, 
    getEstadoCuentaByMatricula,
    getEstadoCuentaReport,
    getListaEstadosCuenta
  };