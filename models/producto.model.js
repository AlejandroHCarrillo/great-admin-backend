var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var clasificacionesValidas = {
    values: ["P", "S"],
    message: '{VALUE} no es una clasificacion permitida'
  }
  
const ProductoSchema = Schema({
    activo: { type: Boolean, default: true },
    nombre: { type: String, required: [true, "El nombre es requerido"] },
    code: { type: String, unique: true, required: [true, "La clave debe ser unica"] },
    descripcion: { type: String, required: [true, "La descripcion es requerida"] },
    img: { type: String, required: false },
    precio: { type: Number, required: true, default: 0 },
    tasaIVA: { type: Number, default: 0 },
    exentoIVA: { type: Boolean, default: false },
    conceptocontable: { type: String, required: false },
    clasificacion: { type: String, required: true, default: "PROD", enum: clasificacionesValidas }, 

    fechaalta: { type: Date, required: true },
    usuarioalta: { type: String, required: true },
    fechaactualizacion: { type: Date, required: true },
    usuarioactualizacion: { type: String, required: true }
});

ProductoSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser unico" });

module.exports = mongoose.model( 'Producto', ProductoSchema );