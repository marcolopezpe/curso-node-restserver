import express from "express";
import cors from "cors";
import routerAuth from "../routes/auth.js";
import routerCategorias from "../routes/categorias.js";
import routerUsuarios from "../routes/usuarios.js";
import routerProductos from "../routes/productos.js";
import routerBuscar from "../routes/buscar.js";
import routerUploads from "../routes/uploads.js";
import dbConnection from "../database/config.js";
import fileUpload from "express-fileupload";

export class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/categorias',
      usuarios: '/api/usuarios',
      productos: '/api/productos',
      uploads: '/api/uploads',
    }
    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes()
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static('public'));

    // Carga de archivo
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    }));
  }

  routes() {
    this.app.use(this.paths.auth, routerAuth);
    this.app.use(this.paths.categorias, routerCategorias);
    this.app.use(this.paths.buscar, routerBuscar);
    this.app.use(this.paths.usuarios, routerUsuarios);
    this.app.use(this.paths.productos, routerProductos);
    this.app.use(this.paths.uploads, routerUploads);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port);
    });
  }
}