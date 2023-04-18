import Rol from "../models/role.js";
import Usuario from "../models/usuario.js";

const esRolValido = async (rol = '') => {
  const existeRol = await Rol.findOne({rol});
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
}

const emailExiste = async (correo = '') => {
  const existeEmail = await Usuario.findOne({correo});
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado`);
  }
}

export {
  esRolValido,
  emailExiste
}