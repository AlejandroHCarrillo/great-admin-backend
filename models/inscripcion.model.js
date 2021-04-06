const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var estadosValidos = {
    values: ["INSCRITO", "BAJA"],
    message: '{VALUE} no es un estus permitido'
}

const inscripcionSchema = new Schema({
    alumno: { type: Schema.Types.ObjectId, ref: 'Alumno', required: [true, "El id del alumno es requerido"] },
    cicloescolar: { type: Schema.Types.ObjectId, ref: 'CicloEscolar', required: true },

    estatus: { type: String, required: true, default: "INSCRITO", enum: estadosValidos }, 

    fechaalta: { type: Date, required: true },
    usuarioalta: { type: String, required: true },
    fechaactualizacion: { type: Date, required: true },
    usuarioactualizacion: { type: String, required: true }

}, { toJSON: { virtuals: true, }, collection: 'inscripciones' });

module.exports = mongoose.model("Inscripcion", inscripcionSchema);