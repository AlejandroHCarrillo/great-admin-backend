var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var roleSchema = new Schema({    
  activo: { type: Boolean, default: true },
  nombre: { type: String, required: [true, "El nombre del rol es requerido"], unique: true  },
  clave: { type: String },
  descripcion: { type: String },

  fechaalta: { type: Date, required: true },
  usuarioalta: { type: String, required: true },
  fechaactualizacion: { type: Date, required: true },
  usuarioactualizacion: { type: String, required: true }

}, {	collection: 'roles' });

roleSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser unico" });

roleSchema.method('toJSON', function() {
  var obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
});

module.exports = mongoose.model("Roles", roleSchema);
