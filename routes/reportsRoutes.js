import express from "express";
import ReportsController from "../controllers/ReportsController.js";

const router = express.Router();

router.get("/summary", ReportsController.getSummary);
router.get("/category/:id", ReportsController.getCategoryReport);
router.get("/person/:id", ReportsController.getPersonReport);
router.get("/stuff/:id", ReportsController.getStuffReport);

export default router;
