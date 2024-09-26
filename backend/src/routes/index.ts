import { Router } from "express";
import authRoutes from "./auth.routes";
import productsRoutes from "./products.routes";
import usersRoutes from "./users.routes";
import cartRoutes from "./cart.routes";
import orderRoutes from "./orders.routes";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productsRoutes);
rootRouter.use("/users", usersRoutes);
rootRouter.use("/carts", cartRoutes);
rootRouter.use("/orders", orderRoutes);

export default rootRouter;
