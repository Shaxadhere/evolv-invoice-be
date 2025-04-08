import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose from 'mongoose'; 
import sequence from 'mongoose-sequence';

const AutoIncrement = sequence(mongoose);

const invoiceItemSchema = new Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
});

const bankDetailsSchema = new Schema({
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountTitle: { type: String, required: true },
});

const invoiceSchema = new Schema({
    invoiceNumber: { type: Number },
    invoiceDate: { type: String, required: true },
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientAddress: [{ type: String, required: true }],
    companyName: { type: String, required: true },
    companyTagline: { type: String, required: true },
    invoiceItems: { type: [invoiceItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    bankDetails: { type: bankDetailsSchema, required: true },
    contactPhone: { type: String, required: true },
    contactWebsite: { type: String, required: true },
    contactEmail: { type: String, required: true },
}, { timestamps: true });

invoiceSchema.plugin(AutoIncrement, { inc_field: 'invoiceNumber' });
invoiceSchema.plugin(mongooseAggregatePaginate);
const Invoice = model('Invoice', invoiceSchema);
export default Invoice
