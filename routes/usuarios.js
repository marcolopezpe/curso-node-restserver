import {Router} from "express";
import {usuariosDelete, usuariosGet, usuariosPatch, usuariosPost, usuariosPut} from "../controllers/usuarios.js";
import {check} from "express-validator";
import {validarCampos} from "../middlewares/validar-campos.js";
import {emailExiste, esRolValido} from "../helpers/db-validators.js";

const router = Router();

router.get("/", usuariosGet);

router.put("/:id", usuariosPut);

router.post("/", [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El Password debe ser más de 6 letras.').isLength({min: 6}),
  check('correo', 'El correo no es válido').isEmail(),
  //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom(esRolValido),
  check('correo').custom(emailExiste),
  validarCampos
], usuariosPost);

router.patch("/", usuariosPatch);

router.delete("/", usuariosDelete);

export default router;