import {Router} from "express";
import {check} from "express-validator";
import {usuariosDelete, usuariosGet, usuariosPatch, usuariosPost, usuariosPut} from "../controllers/usuarios.js";
import {emailExiste, esRolValido, existeUsuarioPorId} from "../helpers/db-validators.js";

import {tieneRole, validarCampos, validarJwt} from "../middlewares/index.js";
const router = Router();

router.get("/", usuariosGet);

router.put("/:id", [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('rol').custom(esRolValido),
  validarCampos
], usuariosPut);

router.post("/", [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El Password debe ser más de 6 letras.').isLength({min: 6}),
  check('correo', 'El correo no es válido').isEmail(),
  check('rol').custom(esRolValido),
  check('correo').custom(emailExiste),
  validarCampos
], usuariosPost);

router.patch("/", usuariosPatch);

router.delete("/:id", [
  validarJwt,
  // esAdminRole,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], usuariosDelete);

export default router;