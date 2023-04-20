import {request, response} from "express";
import {Categoria, Producto, Usuario} from "../models/index.js";
import mongoose from "mongoose";
import Role from "../models/role.js";

const coleccionesPermitidas = [
  'usuarios',
  'categorias',
  'productos',
  'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {
  const esMongoID = mongoose.Types.ObjectId.isValid(termino); // True
  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: (usuario) ? [usuario] : []
    });
  }

  const regex = new RegExp(termino, 'i');
  const usuarios = await Usuario.find({
    $or: [{nombre: regex}, {correo: regex}],
    $and: [{estado: true}]
  });

  return res.json({
    results: usuarios
  });
}

const buscarCategorias = async (termino = '', res = response) => {
  const esMongoID = mongoose.Types.ObjectId.isValid(termino); // True
  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: (categoria) ? [categoria] : []
    });
  }

  const regex = new RegExp(termino, 'i');
  const categorias = await Usuario.find({
    $or: [{nombre: regex}],
    $and: [{estado: true}]
  });

  return res.json({
    results: categorias
  });
}

const buscarProductos = async (termino = '', res = response) => {
  const esMongoID = mongoose.Types.ObjectId.isValid(termino); // True
  if (esMongoID) {
    const producto = await Producto.findById(termino).populate('categoria', 'nombre');
    return res.json({
      results: (producto) ? [producto] : []
    });
  }

  const regex = new RegExp(termino, 'i');
  const productos = await Producto.find({
    $or: [{nombre: regex}],
    $and: [{estado: true}]
  }).populate('categoria', 'nombre');

  return res.json({
    results: productos
  });
}

const buscarRoles = async (termino = '', res = response) => {
  const esMongoID = mongoose.Types.ObjectId.isValid(termino); // True
  if (esMongoID) {
    const rol = await Role.findById(termino);
    return res.json({
      results: (rol) ? [rol] : []
    });
  }

  const regex = new RegExp(termino, 'i');
  const roles = await Role.find({
    $or: [{nombre: regex}],
    $and: [{estado: true}]
  });

  return res.json({
    results: roles
  });
}

const buscar = async (req = request, res = response) => {

  const {coleccion, termino} = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
    });
  }

  switch (coleccion) {
    case 'usuarios':
      return await buscarUsuarios(termino, res);
    case 'categorias':
      return await buscarCategorias(termino, res);
    case 'productos':
      return await buscarProductos(termino, res);
    case 'roles':
      return await buscarRoles(termino, res);
    default:
      return res.status(500).json({
        msg: 'Se me olvidó hacer esta búsqueda'
      });
  }
}

export {
  buscar
}