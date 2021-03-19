const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientealumnoSchema = new Schema({
    cliente:{ type: Schema.Types.ObjectId, ref: 'Cliente', required: [true, "El id del cliente es requerido"] },
    alumno:{ type: Schema.Types.ObjectId, ref: 'Alumno', required: [true, "El id del alumno es requerido"] },
   
    fechaalta: { type: Date, required: true },
    usuarioalta: { type: String, required: true },
    fechaactualizacion: { type: Date, required: true },
    usuarioactualizacion: { type: String, required: true }

}, { collection: 'clientealumnosRel' });

module.exports = mongoose.model("ClienteAlumno", clientealumnoSchema);