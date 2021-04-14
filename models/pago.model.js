var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

const estadosValidos = {
    values: ["NO_APLICADO", "APLICADO", "APLICACION_PARCIAL", "CANCELADO", "DEVUELTO"],
    message: '{VALUE} no es un estatus permitido'
}

const formaspagoValidos = {
    values: ["EF", "DEPEF", "TRNS", "TC", "TD", "CHQ", "OTRO"],
    message: '{VALUE} no es un estatus permitido'
}

const pagoSchema = new Schema({
    folio: { type: Number, default: 1, unique: true },
    fechapago: { type: Date, required: true },
    alumno: { type: Schema.Types.ObjectId, ref: 'Alumno', required: [true, "El id del alumno es requerido"] },

    formapago: { type: String, required: true, required: true, default: "NO_PAGADO", enum: formaspagoValidos }, 
    montopagado: { type: Number, required: [ true ], default:0 },

    estatus: { type: String, required: true, default: "NO_APLICADO", enum: estadosValidos }, 

    fechaalta: { type: Date, required: true },
    usuarioalta: { type: String, required: true },
    fechaactualizacion: { type: Date, required: true },
    usuarioactualizacion: { type: String, required: true }

}, { toJSON: { virtuals: true, }, collection: 'pagos' });

autoIncrement.initialize(mongoose.connection);
pagoSchema.plugin(autoIncrement.plugin, { model: 'pagoSchema', 
                                          field: 'folio',
                                          startAt: 1,
                                          incrementBy: 1
                                        });

module.exports = mongoose.model("Pago", pagoSchema);
