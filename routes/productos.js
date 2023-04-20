import {Router} from "express";
import {esAdminRole, validarCampos, validarJwt} from "../middlewares/index.js";
import {check} from "express-validator";
import {existeCategoriaPorId, existeProductoPorId} from "../helpers/db-validators.js";
import {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos
} from "../controllers/productos.js";

const router = Router();

// Obtener todos los productos - publico
router.get('/', obtenerProductos);


// Obtener un producto por id - publico
router.get('/:id', [
  check('id', 'No es un ID de Mongo válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos,
], obtenerProducto);


// Crear producto - privado - cualquier persona con un token válido
router.post('/', [
  validarJwt,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'No es un ID de Categoria de Mongo válido').isMongoId(),
  check('categoria').custom(existeCategoriaPorId),
  validarCampos
], crearProducto);


// Actualizar Producto - privado - cualquiera con token válido
router.put('/:id', [
  validarJwt,
  check('categoria', 'No es un ID de Categoria de Mongo válido').isMongoId(),
  check('categoria').custom(existeCategoriaPorId),
  check('id').custom(existeProductoPorId),
  validarCampos
], actualizarProducto);


// Borrar un Producto - Admin
router.delete('/:id', [
  validarJwt,
  esAdminRole,
  check('id', 'No es un ID de Mongo válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
], borrarProducto);


export default router;