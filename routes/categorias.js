import {Router} from "express";
import {check} from "express-validator";
import {esAdminRole, validarCampos, validarJwt} from "../middlewares/index.js";
import {
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias
} from "../controllers/categorias.js";
import {existeCategoriaPorId} from "../helpers/db-validators.js";

const router = Router();

// Obtener todos las categorias - publico
router.get('/', obtenerCategorias);


// Obtener una categoria por id - publico
router.get('/:id', [
  check('id', 'No es un ID de Mongo válido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos,
], obtenerCategoria);


// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
  validarJwt,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria);


// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
  validarJwt,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
], actualizarCategoria);


// Borrar una categoria - Admin
router.delete('/:id', [
  validarJwt,
  esAdminRole,
  check('id', 'No es un ID de Mongo válido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
], borrarCategoria);


export default router;