import express from "express";
import { createInvoice, deleteInvoice, getInvoice, getInvoices, updateInvoice } from "../controllers/invoice.controller.js";
import { authenticatedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticatedRoute, getInvoices);
router.get("/:id", authenticatedRoute, getInvoice);
router.post("/", authenticatedRoute, createInvoice);
router.put("/:id", authenticatedRoute, updateInvoice);
router.delete("/:id", authenticatedRoute, deleteInvoice);

export default router;