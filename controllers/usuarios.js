import {request, response} from "express";
import Usuario from "../models/usuario.js";
import bcryptjs from "bcryptjs";

const usuariosGet = (req = request, res = response) => {
  const {q, nombre = 'No Name', apikey, page = 1, limit = 10} = req.query;

  res.json({
    msg: "get API",
    q,
    nombre,
    apikey,
    page,
    limit
  });
};

const usuariosPost = async (req = request, res = response) => {
  const {nombre, correo, password, rol} = req.body;
  const usuario = new Usuario({nombre, correo, password, rol});

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await usuario.save();

  res.json({
    msg: "post API",
    usuario
  });
}

const usuariosPut = async (req = request, res = response) => {
  const id = req.params.id;

  const {_id, password, google, correo, ...resto} = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.status(400).json({
    msg: "put API - usuariosPut",
    usuario
  });
}

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API"
  });
}

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: "delete API"
  });
}

export {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}