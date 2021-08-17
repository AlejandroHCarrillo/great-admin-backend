var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var permisosRoleSchema = new Schema({
  activo: { type: Boolean, default: true },
  role:{ type: Schema.Types.ObjectId, ref: 'Roles', required: [true, "El id del rol es requerido"] },
  pantalla:{ type: Schema.Types.ObjectId, ref: 'Pantalla', required: [true, "El id de la pantalla es requerido"] },

  read: { type: Boolean, default: true },
  write: { type: Boolean, default: false },

  fechaalta: { type: Date, required: true },
  usuarioalta: { type: String, required: true },
  fechaactualizacion: { type: Date, required: true },
  usuarioactualizacion: { type: String, required: true }

}, { collection: 'permisosRole' });

roleSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser unico" });

roleSchema.method('toJSON', function() {
  var obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
});

module.exports = mongoose.model("PermisoRol", permisosRoleSchema);
