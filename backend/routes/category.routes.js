import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getCategories);
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
