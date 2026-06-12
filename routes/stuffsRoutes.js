import express from "express";
import StuffsController from "../controllers/StuffsController.js";

const router = express.Router();

router.get("/:id", StuffsController.getStuffById);
router.get("/", StuffsController.getStuffs);
router.post("/", StuffsController.createStuff);
router.put("/:id", StuffsController.updateStuff);
router.delete("/:id", StuffsController.deleteStuff);

export default router;
