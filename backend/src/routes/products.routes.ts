import { Router } from "express";
import { errorHandler } from "../exceptions/error-handler";
import {
  createProduct,
  createProducts,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "../controllers/products.controller";
import authMiddleware from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const productsRoutes: Router = Router();

productsRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);
productsRoutes.post(
  "/multiple/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProducts) // essa rota espera um array de produtos, ou seja, serve para criar multiplos produtos
);
productsRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);
productsRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);
productsRoutes.get("/", errorHandler(listProducts));
productsRoutes.get("/:id", errorHandler(getProductById));

export default productsRoutes;
