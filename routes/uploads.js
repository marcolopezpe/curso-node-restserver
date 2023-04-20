import {Router} from "express";
import {actualizarImagen, actualizarImagenCloudinary, cargarArchivo, mostrarImagen} from "../controllers/uploads.js";
import {check} from "express-validator";
import {validarArchivoSubir, validarCampos} from "../middlewares/index.js";
import {coleccionesPermitidas} from "../helpers/index.js";

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
  validarArchivoSubir,
  check('id', 'El id debe ser de Mongo').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
  check('id', 'El id debe ser de Mongo').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], mostrarImagen);

export default router;