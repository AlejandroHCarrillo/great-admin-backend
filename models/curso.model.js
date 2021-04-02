const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const Cargo = require("./curso.cargo.model");
const Schema = mongoose.Schema;

var estadosValidos = {
    values: ["VIGENTE", "CERRADO", "DESCONTINUADO"],
    message: '{VALUE} no es un estatus permitido'
}

var nivelesValidos = {
    values: ["KINDER", "PRIMARIA", "SECUNDARIA", "PREPARATORIA", "LICENCIATURA", "POSGRADO", "DOCTORADO"],
    message: '{VALUE} no es un nivel permitido'
}

const cursoSchema = new Schema({
    code: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: false },

    nivel: { type: String, required: true, default: "PRIMARIA", enum: nivelesValidos }, 
    grado: { type: Number, required: [ false ], default:1},
   
    fechaprimerpago: { type: Date, required: false },
    intervalopagos: { type: Number, required: [ false ], default:1},

    estatus: { type: String, required: true, default: "VIGENTE", enum: estadosValidos }, 

    fechaalta: { type: Date, required: true },
    usuarioalta: { type: String, required: true },
    fechaactualizacion: { type: Date, required: true },
    usuarioactualizacion: { type: String, required: true }

}, { toJSON: { virtuals: true, }, collection: 'cursos' });

// cursoSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser unico" });

// cursoSchema.method('toJSON', function() {
//     var obj = this.toObject();
  
//     //Rename fields
//     obj.id = obj._id;
//     delete obj._id;
//     delete obj.__v;
 
//     return obj;
//   });

module.exports = mongoose.model("Curso", cursoSchema);