import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  getUserById,
  listAddress,
  listUsers,
  updateUser,
} from "../controllers/users";

const usersRoutes: Router = Router();

usersRoutes.post("/address", [authMiddleware], errorHandler(addAddress));
usersRoutes.delete(
  "/address/:id",
  [authMiddleware],
  errorHandler(deleteAddress)
);
usersRoutes.get("/address", [authMiddleware], errorHandler(listAddress));
usersRoutes.put("/", [authMiddleware], errorHandler(updateUser));
usersRoutes.put("/:id/role", [authMiddleware], errorHandler(changeUserRole));
usersRoutes.get("/", [authMiddleware], errorHandler(listUsers));
usersRoutes.get("/:id", [authMiddleware], errorHandler(getUserById));

export default usersRoutes;
