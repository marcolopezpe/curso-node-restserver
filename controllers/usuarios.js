import {request, response} from "express";
import Usuario from "../models/usuario.js";
import bcryptjs from "bcryptjs";

const usuariosGet = async (req = request, res = response) => {
  const {limite = 5, desde = 0} = req.query;
  const query = {estado: true};

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
  ]);

  res.json({
    total,
    usuarios
  });
};

const usuariosPost = async (req = request, res = response) => {
  const {nombre, correo, password, rol} = req.body;
  const usuario = new Usuario({nombre, correo, password, rol});

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.google = false;
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

const usuariosDelete = async (req = request, res = response) => {
  const {id} = req.params;

  const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
  const usuarioAutenticado = req.usuario;

  res.json({usuario, usuarioAutenticado});
}

export {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}