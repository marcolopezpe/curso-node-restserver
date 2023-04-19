import {Router} from "express";
import {usuariosDelete, usuariosGet, usuariosPatch, usuariosPost, usuariosPut} from "../controllers/usuarios.js";
import {check} from "express-validator";
import {validarCampos} from "../middlewares/validar-campos.js";
import {emailExiste, esRolValido, existeUsuarioPorId} from "../helpers/db-validators.js";

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
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
],usuariosDelete);

export default router;