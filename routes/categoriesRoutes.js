import express from "express";
import CategoriesController from "../controllers/CategoriesController.js";

const router = express.Router();

router.get("/:id", CategoriesController.getCategoryById);
router.get("/", CategoriesController.getCategories);
router.post("/", CategoriesController.createCategory);
router.put("/:id", CategoriesController.updateCategory);
router.delete("/:id", CategoriesController.deleteCategory);

export default router;
