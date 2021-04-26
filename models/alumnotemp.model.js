var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var alumnotempSchema = new Schema({
  folio: { type: Number, required: false },
  matricula: { type: String, required: false, unique: true },
  nombre: { type: String, required: [true, "El nombre es requerido"] },
  apellidos: { type: String, required: [true, "Los apellidos son requeridos"] },
  nivel: { type: String, required: false, default:"primaria" },
  email: { type: String, required: [false, "El correo es necesario"]
  },
  hoja: { type: String },
  
  fechaalta: { type: Date, required: false },
  usuarioalta: { type: String, required: false },
  fechaactualizacion: { type: Date, required: false },
  usuarioactualizacion: { type: String, required: false }

}, { collection: 'alumnostemp' });

alumnotempSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser unico" });
alumnotempSchema.method('toJSON', function() {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
});

module.exports = mongoose.model("Alumnotemp", alumnotempSchema);
