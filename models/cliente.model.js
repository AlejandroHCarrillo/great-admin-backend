var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var clienteSchema = new Schema({
  activo: { type: Boolean, default: true },
  nombre: { type: String, required: [true, "El nombre es requerido"] },
  apaterno: { type: String, required: [true, "El apellido paterno es requerido"] },
  amaterno: { type: String, required: false },
  fechaNacimiento: { type:Date, required: true },
  rfc: { type: String },
  fechaIngreso: { type:Date, required: true },
  curp: { type: String },
  sexo: { type: String },

  callenumero: { type: String },
  colonia: { type: String },
  municipio: { type: String },
  estado: { type: String },
  codigopostal: { type: String },

  tcelular: { type: String },
  tcasa: { type: String },
  ttrabajo: { type: String },

  email: { type: String, required: [true, "El correo es necesario"]
  },
  notas: { type: String },

});

clienteSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser unico" });

module.exports = mongoose.model("Cliente", clienteSchema);
