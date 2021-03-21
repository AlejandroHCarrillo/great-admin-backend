const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var estadosValidos = {
    values: ["NO_PAGADO", "PAGO_PARCIAL", "PAGADO", "CANCELADO"],
    message: '{VALUE} no es un rol permitido'
  }

const cargoSchema = new Schema({
    alumno: { type: Schema.Types.ObjectId, ref: 'Alumno', required: [true, "El id del alumno es requerido"] },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },

    monto: { type: Number, required: [ true ], default:0},
    concepto: { type: String, required: true },
    
    montopagado: { type: Number, required: [ false ], default:0},

    fechavencimiento: { type: Date, required: false },

    estatus: { type: String, required: true, default: "NO_PAGADO", enum: estadosValidos }, 

    fechaalta: { type: Date, required: true },
    usuarioalta: { type: String, required: true },
    fechaactualizacion: { type: Date, required: true },
    usuarioactualizacion: { type: String, required: true }

}, { collection: 'cargos' });

module.exports = mongoose.model("Cargo", cargoSchema);