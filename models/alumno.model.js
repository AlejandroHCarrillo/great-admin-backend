var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var alumnoSchema = new Schema({
  activo: { type: Boolean, default: true },
  nombre: { type: String, required: [true, "El nombre es requerido"] },
  apaterno: { type: String, required: [true, "El apellido paterno es requerido"] },
  amaterno: { type: String, required: false },
  fechaNacimiento: { type:Date, required: true },

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
  
  urlFoto: { type: String },

  fechaalta: { type: Date, required: true },
  usuarioalta: { type: String, required: true },
  fechaactualizacion: { type: Date, required: true },
  usuarioactualizacion: { type: String, required: true }

});

alumnoSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser unico" });

module.exports = mongoose.model("Alumno", alumnoSchema);
