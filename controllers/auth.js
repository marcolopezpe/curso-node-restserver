import {request, response} from "express";
import Usuario from "../models/usuario.js";
import {generarJwt} from "../helpers/generar-jwt.js";
import bcryptjs from "bcryptjs";
import {googleVerify} from "../helpers/google-verify.js";

const login = async (req = request, res = response) => {

  const {correo, password} = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({correo});
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario/Password no son correctos - correo'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario/Password no son correctos - estado: false'
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario/Password no son correctos - password'
      });
    }

    // Generar el JWT (JSON Web Token)
    const token = await generarJwt(usuario.id);

    res.json({
      usuario,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }

}

const googleSignIn = async (req = request, res = response) => {

    const {id_token} = req.body;

    try {
      const {nombre, img, correo} = await googleVerify(id_token);

      // Verificar si el correo existe
      let usuario = await Usuario.findOne({correo});
      if (!usuario) {
        // Tengo que crearlo
        const data = {
          nombre,
          correo,
          password: ':P',
          img,
          google: true,
          rol: 'USER_ROLE'
        };
        usuario = new Usuario(data);
        await usuario.save();
      }

      // Si el usuario en DB
      if (!usuario.estado) {
        return res.status(401).json({
          msg: 'Hable con el administrador, usuario bloqueado'
        });
      }

      // Generar el JWT (JSON Web Token)
      const token = await generarJwt(usuario.id);

      res.json({
        usuario,
        token
      });

    } catch (error) {

      console.log(error);
      res.status(400).json({
        msg: 'El Token no se pudo verificar'
      });
    }
}

export {
  login,
  googleSignIn
}