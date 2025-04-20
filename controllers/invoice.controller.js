import Invoice from "../models/invoice.model.js";
import { create, deleteOne, getAll, getOne, updateOne, updateStatus } from "../generics/crud.generics.js"

//get all invoices, use aggregate paginate, use size and page query params, use sort query param, use search query param
export function getInvoices(req, res) {
    return getAll(Invoice, req, res, {}, [
        'invoiceNumber',
        'clientName',
        'clientEmail'
    ]);
}

//get a single invoice by id
export function getInvoice(req, res) {
    return getOne(Invoice, req, res);
}

//create a new invoice
export function createInvoice(req, res) {
    const body = req.body
    body.totalAmount = body.invoiceItems.reduce((acc, item) => acc + item.amount, 0)
    req.body = body
    return create(Invoice, req, res);
}

//update a invoice by id and return the updated invoice
export function updateInvoice(req, res) {
    return updateOne(Invoice, req, res);
}

//for only update invoice status
export function updateInvoiceStatus(req, res) {
    // const body = req.body
    // const invoiceStatus = body.invoiceStatus
    // req.body = { invoiceStatus: invoiceStatus }
    return updateStatus(Invoice, req, res);
}

//delete a invoice by id
export function deleteInvoice(req, res) {
    return deleteOne(Invoice, req, res);
}