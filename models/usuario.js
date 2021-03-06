var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

var rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
  nombre: { type: String, required: [true, "El nombre es requerido"] },
  username: { type:String, required: true, unique: true },
  apellidoP: { type: String, required: [true, "El apellido paterno es requerido"] },
  apellidoM: { type: String, required: false },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"]
  },
  password: { type: String, required: [true, "El password es requrido"] },
  img: { type: String, required: false },
  role: { type: String, required: true, default: "USER_ROLE", enum: rolesValidos }, 
  google: { type: Boolean, default: false }
});

usuarioSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser unico" });

module.exports = mongoose.model("User", usuarioSchema);
