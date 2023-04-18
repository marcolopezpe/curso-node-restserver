import {request, response} from "express";

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

const usuariosPost = (req = request, res = response) => {
  const {nombre, edad} = req.body;

  res.json({
    msg: "post API",
    nombre,
    edad
  });
}

const usuariosPut = (req = request, res = response) => {
  const id = req.params.id;

  res.status(400).json({
    msg: "put API",
    id
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