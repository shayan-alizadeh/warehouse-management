import InvoiceItem from "../models/InvoiceItemModel.js";
import Invoice from "../models/InvoiceModel.js";
import Person from "../models/PersonModel.js";
import Stuff from "../models/StuffModel.js";
import sequelize from "../utils/db.js";
import { parseDBError } from "../utils/helperFunctions.js";

export default class InvoicesController {
    static async getInvoiceById(req, res) {
        const id = +req.params.id;

        try {
            const invoice = await Invoice.findByPk(id, {
                include: [
                    { model: Person, attributes: ["fullname"] },
                    {
                        model: Stuff,
                        through: { attributes: ["unitPrice", "quantity"] },
                        attributes: ["id", "title"],
                    },
                ],
            });
            if (invoice) {
                res.success("فاکتور با موفقیت خوانده شد", invoice);
            } else {
                res.fail("فاکتور یافت نشد", 404);
            }
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async getInvoices(req, res) {
        const limit = +(req.query.limit ?? DEFAULT_LIMIT);
        const page = +(req.query.page ?? 1);
        const type = (req.query.type ?? "").toLowerCase();
        const personId = +(req.query.personId ?? 0);

        const where = {};
        if (type) {
            where.type = type;
        }
        if (personId) {
            where.personId = personId;
        }

        try {
            const { rows, count } = await Invoice.findAndCountAll({
                where,
                limit,
                offset: (page - 1) * limit,
                order: [["date", "DESC"]],
                include: [{ model: Person, attributes: ["fullname"] }],
            });
            res.success("فاکتورها با موفقیت خوانده شدند", {
                invoices: rows,
                count,
            });
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async createInvoice(req, res) {
        const { type, personId, date, description, invoiceNumber, items } = req.body;
        if (!items?.length) {
            return res.fail("فاکتور باید حداقل یک کالا داشته باشد");
        }

        try {
            await sequelize.transaction(async () => {
                const invoice = await Invoice.create({
                    type,
                    personId,
                    date,
                    description,
                    invoiceNumber,
                });
                for (let item of items) {
                    item.invoiceId = invoice.id;
                }
                await InvoiceItem.bulkCreate(items, { validate: true });
                await invoice.updatePrice();
                await invoice.reload({ include: [Person, Stuff] });
                res.success("فاکتور با موفقیت ایجاد شد", invoice, 201);
            });
        } catch (e) {
            const error = parseDBError(e);
            res.fail(error.message, error.code);
        }
    }

    static async updateInvoice(req, res) {
        const { type, personId, date, description, invoiceNumber, items } = req.body;
        const id = +req.params.id;
        if (!items?.length) {
            return res.fail("فاکتور باید حداقل یک کالا داشته باشد");
        }

        try {
            await sequelize.transaction(async () => {
                const invoice = await Invoice.findByPk(id);
                if (!invoice) {
                    return res.fail("فاکتور یافت نشد", 404);
                }
                await invoice.update({
                    type,
                    personId,
                    date,
                    description,
                    invoiceNumber,
                });
                await InvoiceItem.destroy({ where: { invoiceId: id } });
                for (let item of items) {
                    item.invoiceId = invoice.id;
                }
                await InvoiceItem.bulkCreate(items, { validate: true });
                await invoice.updatePrice();
                res.success("فاکتور با موفقیت بروز شد");
            });
        } catch (e) {
            const error = parseDBError(e);
            res.fail(error.message, error.code);
        }
    }

    static async deleteInvoice(req, res) {
        const id = +req.params.id;

        try {
            const invoice = await Invoice.destroy({ where: { id } });
            if (invoice) {
                res.success("فاکتور با موفقیت حذف شد");
            } else {
                res.fail("فاکتور یافت نشد", 404);
            }
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }
}
