import mongoose from "mongoose";

const CategoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  }
});

CategoriaSchema.methods.toJSON = function () {
  const {__v, estado, ...categoria} = this.toObject();
  return categoria;
}

export default mongoose.model("Categoria", CategoriaSchema);