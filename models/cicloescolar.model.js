var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var cicloescolarSchema = new Schema({    
  activo: { type: Boolean, default: true },
  nombre: { type: String, required: [true, "El nombre del cliclo es requerido"], unique: true  },

  fechaInicio: { type:Date, required: true },
  fechaFin: { type:Date, required: true },

  fechaalta: { type: Date, required: true },
  usuarioalta: { type: String, required: true },
  fechaactualizacion: { type: Date, required: true },
  usuarioactualizacion: { type: String, required: true }

}, {	collection: 'ciclosescolares' });

cicloescolarSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser unico" });

cicloescolarSchema.method('toJSON', function() {
  var obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
});

module.exports = mongoose.model("CicloEscolar", cicloescolarSchema);
