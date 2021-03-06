var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var nivelesValidos = {
  values: ["kinder", "primaria", "secundaria"],
  message: '{VALUE} no es un nivel permitido'
}

var alumnoSchema = new Schema({
  activo: { type: Boolean, default: true },
  nombre: { type: String, required: [true, "El nombre es requerido"] },
  apaterno: { type: String, required: [true, "El apellido paterno es requerido"] },
  amaterno: { type: String, required: false },
  matricula: { type: String, required: false, unique: true },
  nivel: { type: String, required: false, default:"primaria" },
  grado: { type: String, required: false, default:"0" },
  grupo: { type: String, required: false, default:"ND" },

  fechaNacimiento: { type:Date, required: true },

  fechaIngreso: { type:Date, required: true },
  curp: { type: String },
  sexo: { type: String },

  beca: { type: Number, required: false, default:0 },
  prestacion: { type: Number, required: false, default:0 },
  apoyo: { type: Number, required: false, default:0 },

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
  
  img: { type: String, required: false },

  fechaalta: { type: Date, required: true },
  usuarioalta: { type: String, required: true },
  fechaactualizacion: { type: Date, required: true },
  usuarioactualizacion: { type: String, required: true }

}, {	collection: 'alumnos' });

alumnoSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser unico" });

alumnoSchema.method('toJSON', function() {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
});

module.exports = mongoose.model("Alumno", alumnoSchema);
