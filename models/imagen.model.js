var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var imagenSchema = new Schema({
  ownerId: { type: String, default: true },
  tipoCatalogo: { type: String, required: false },
  titulo: { type: String, required: false },
  url: { type: String, required: true },
  
  fechaalta: { type: Date, required: true },
  usuarioalta: { type: String, required: true },
  fechaactualizacion: { type: Date, required: true },
  usuarioactualizacion: { type: String, required: true }

});

module.exports = mongoose.model("Image", imagenSchema);
