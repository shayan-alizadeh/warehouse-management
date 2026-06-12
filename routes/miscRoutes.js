import express from "express";
import MiscController from "../controllers/MiscController.js";

const router = express.Router();

router.get("/init", MiscController.initialize);

export default router;
