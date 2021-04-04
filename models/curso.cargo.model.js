const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cargocursoSchema = new Schema({
    curso: { type: Schema.Types.ObjectId, ref: 'Curso', required: [true, "El id del alumno es requerido"] },
    // producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },

    nombre: { type: String, required: true },

    precio: { type: Number, required: [ false ], default:0},
    tasaIVA: { type: Number, required: [ false ], default:0},
    monto: { type: Number, required: [ true ], default:0},

    numpagos: { type: Number, required: [ true ], default:1},
    intervalopagos: { type: Number, required: [ true ], default:1},

    fechaalta: { type: Date, required: true },
    usuarioalta: { type: String, required: true },
    fechaactualizacion: { type: Date, required: true },
    usuarioactualizacion: { type: String, required: true }

}, { toJSON: { virtuals: true, }, collection: 'cargoscursos' });

module.exports = mongoose.model("CargoCurso", cargocursoSchema);