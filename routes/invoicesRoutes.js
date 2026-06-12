import express from "express";
import InvoicesController from "../controllers/InvoicesController.js";

const router = express.Router();

router.get("/:id", InvoicesController.getInvoiceById);
router.get("/", InvoicesController.getInvoices);
router.post("/", InvoicesController.createInvoice);
router.put("/:id", InvoicesController.updateInvoice);
router.delete("/:id", InvoicesController.deleteInvoice);

export default router;
