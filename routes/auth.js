import {Router} from "express";
import {googleSignIn, login} from "../controllers/auth.js";
import {check} from "express-validator";
import {validarCampos} from "../middlewares/index.js";

const router = Router();

router.post('/login', [
  check('correo', 'El correo es obligatorio').isEmail(),
  check('password', 'El password es obligatorio').not().isEmpty(),
  validarCampos
], login);

router.post('/google', [
  check('id_token', 'El id_token es necesario').not().isEmpty(),
  validarCampos
], googleSignIn);

export default router;