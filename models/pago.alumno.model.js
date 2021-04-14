const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pagoalumnoSchema = new Schema({
    pago: { type: Schema.Types.ObjectId, ref: 'Pago', required: [true, "El id del pago es requerido"] },
    cargo: { type: Number, required: [ false ], default:0},

    fechaalta: { type: Date, required: true },
    usuarioalta: { type: String, required: true },
    fechaactualizacion: { type: Date, required: true },
    usuarioactualizacion: { type: String, required: true }

}, { toJSON: { virtuals: true, }, collection: 'pagosalumnos' });

module.exports = mongoose.model("Pagoalumno", pagoalumnoSchema);