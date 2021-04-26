/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de alumnos
 */
const { response } = require('express');
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
        alumnotempModel.find({}, "nombre apellidos matricula nivel folio")
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

 const getEstadoCuentaReport = async (req, res = response) => {
     var strMatricula = req.params.matricula;
     console.log("getEstadoCuentaReport...", strMatricula);

     try{
        var objKeyGroup = { $substr: ['$concepto', 0, 11] };
        // var objKeyGroup = { concepto: '$concepto' };
        var objMatch = { matricula: strMatricula };

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


 
 module.exports = {
    getAlumns, 
    getEstadoCuentaByMatricula,
    getEstadoCuentaReport
  };