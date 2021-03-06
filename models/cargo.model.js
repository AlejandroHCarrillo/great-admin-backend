const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var estadosValidos = {
    values: ["NO_PAGADO", "PAGO_PARCIAL", "PAGADO", "CANCELADO"],
    message: '{VALUE} no es un estatus permitido'
  }

const cargoSchema = new Schema({
    tipocargo: { type: String, required: true, default: "Otros" },
    alumno: { type: Schema.Types.ObjectId, ref: 'Alumno', required: [true, "El id del alumno es requerido"] },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: false },
    concepto: { type: String, required: true },

    precio: { type: Number, required: [ false ], default:0},
    tasaIVA: { type: Number, required: [ false ], default:0},
    monto: { type: Number, required: [ true ], default:0},
    
    montopagado: { type: Number, required: [ false ], default:0},

    fechavencimiento: { type: Date, required: false },

    estatus: { type: String, required: true, default: "NO_PAGADO", enum: estadosValidos }, 

    fechaalta: { type: Date, required: true },
    usuarioalta: { type: String, required: true },
    fechaactualizacion: { type: Date, required: true },
    usuarioactualizacion: { type: String, required: true }

}, { toJSON: { virtuals: true, }, collection: 'cargosalumnos' });

module.exports = mongoose.model("Cargo", cargoSchema);