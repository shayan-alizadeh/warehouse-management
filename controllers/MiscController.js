import Category from "../models/CategoryModel.js";
import Invoice from "../models/InvoiceModel.js";

export default class MiscController {
    static async initialize(req, res) {
        try {
            const categories = await Category.findAll();
            const invoice = await Invoice.findOne({
                order: [["invoiceNumber", "DESC"]],
                attributes: ["invoiceNumber"],
            });
            const lastInvoiceNumber = invoice?.invoiceNumber ?? 0;
            res.success("عملیات با موفقیت انجام شد", {
                categories,
                lastInvoiceNumber,
            });
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }
}
