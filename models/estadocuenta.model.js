const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const estadocuentaSchema = new Schema({
    matricula: { type: String, required: true }, 
    nombre: { type: String, required: true }, 
    apellidos: { type: String, required: true }, 
    fecha: { type: Date, required: true },
    concepto: { type: String, required: true },
    cargo: { type: Number, required: true },
    abono: { type: Number, required: true },

    fechaalta: { type: Date, required: false },
    usuarioalta: { type: String, required: false },
    fechaactualizacion: { type: Date, required: false },
    usuarioactualizacion: { type: String, required: false }

}, { toJSON: { virtuals: true, }, collection: 'estadoscuenta' });

module.exports = mongoose.model("estadocuenta", estadocuentaSchema);