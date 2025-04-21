import express from "express";
import {
    createInvoice,
    deleteInvoice,
    getInvoice,
    getInvoices,
    updateInvoice,
    getInvoiceFacet,
    updateInvoiceStatus
} from "../controllers/invoice.controller.js";
import { authenticatedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticatedRoute, getInvoices);
router.get("/facet", authenticatedRoute, getInvoiceFacet);
router.get("/:id", authenticatedRoute, getInvoice);
router.post("/", authenticatedRoute, createInvoice);
router.put("/:id", authenticatedRoute, updateInvoice);
router.patch("/:id", updateInvoiceStatus);
router.delete("/:id", authenticatedRoute, deleteInvoice);

export default router;