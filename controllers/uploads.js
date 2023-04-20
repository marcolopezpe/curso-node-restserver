import {response} from "express";

import {subirArchivo} from "../helpers/index.js";
import {Producto, Usuario} from "../models/index.js";
import path from 'path';
import {fileURLToPath} from "url";
import * as fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cargarArchivo = async (req, res = response) => {

  try {
    const nombre = await subirArchivo(
      req.files,
      ['png', 'jpg', 'jpeg', 'gif'],
      'imgs'
    );

    res.json({
      nombre
    });
  } catch (error) {
    res.status(400).json({msg: error});
  }
}

const actualizarImagen = async (req, res = response) => {

  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: `Se me olvidó validar esto`
      });
  }

  // Limpiar imágenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(
    req.files,
    undefined,
    coleccion
  );
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
}

const mostrarImagen = async (req, res = response) => {

  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: `Se me olvidó validar esto`
      });
  }

  // Limpiar imágenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImagen);
}

export {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen
}