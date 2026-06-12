import sequelize from "../utils/db.js";
import Stuff from "../models/StuffModel.js";
import Category from "../models/CategoryModel.js";
import Person from "../models/PersonModel.js";
import Invoice from "../models/InvoiceModel.js";

export default class ReportsController {
    static async getSummary(req, res) {
        try {
            const categoriesCount = await Category.count();
            const peopleCount = await Person.count();
            const stuffsCount = await Stuff.count();

            const sellInvoicesCount = await Invoice.count({ where: { type: "sell" } });
            const buyInvoicesCount = await Invoice.count({ where: { type: "buy" } });

            const totalSellPrice = await Invoice.sum("totalPrice", { where: { type: "sell" } });
            const totalBuyPrice = await Invoice.sum("totalPrice", { where: { type: "buy" } });

            res.success("عملیات با موفقیت انجام شد", {
                categoriesCount,
                peopleCount,
                stuffsCount,
                sellInvoicesCount,
                buyInvoicesCount,
                totalSellPrice,
                totalBuyPrice,
            });
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async getCategoryReport(req, res) {
        const id = +req.params.id;

        try {
            const category = await Category.findByPk(id, { raw: true });
            const stuffsCount = await Stuff.count({ where: { categoryId: id } });

            const [sellResult] = await sequelize.query(
                `SELECT SUM(unitPrice * quantity) AS totalSell FROM invoices , invoiceitems , stuffs
				WHERE invoiceId = invoices.id AND stuffId = stuffs.id AND type = 'sell' AND categoryId = ${id}`
            );
            const totalSellPrice = +sellResult[0].totalSell;

            const [buyResult] = await sequelize.query(
                `SELECT SUM(unitPrice * quantity) AS totalBuy FROM invoices , invoiceitems , stuffs
				WHERE invoiceId = invoices.id AND stuffId = stuffs.id AND type = 'buy' AND categoryId = ${id}`
            );
            const totalBuyPrice = +buyResult[0].totalBuy;

            res.success("عملیات با موفقیت انجام شد", {
                ...category,
                stuffsCount,
                totalSellPrice,
                totalBuyPrice,
            });
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async getPersonReport(req, res) {
        const id = +req.params.id;

        try {
            const person = await Person.findByPk(id, { raw: true });
            const sellInvoicesCount = await Invoice.count({
                where: { personId: id, type: "sell" },
            });
            const totalSellPrice = +(await Invoice.sum("totalPrice", {
                where: { personId: id, type: "sell" },
            }));

            const buyInvoicesCount = await Invoice.count({
                where: { personId: id, type: "buy" },
            });
            const totalBuyPrice = +(await Invoice.sum("totalPrice", {
                where: { personId: id, type: "buy" },
            }));

            res.success("عملیات با موفقیت انجام شد", {
                ...person,
                sellInvoicesCount,
                totalSellPrice,
                buyInvoicesCount,
                totalBuyPrice,
            });
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async getStuffReport(req, res) {
        const id = +req.params.id;

        try {
            const stuff = await Stuff.findByPk(id, { raw: true });
            const [sellResult] = await sequelize.query(
                `SELECT SUM(unitPrice * quantity) AS totalPrice , SUM(quantity) AS totalCount FROM invoices , invoiceitems , stuffs
				WHERE invoiceId = invoices.id AND stuffId = stuffs.id AND type = 'sell' AND stuffId = ${id}`
            );
            const totalSellPrice = +sellResult[0].totalPrice;
            const totalSellCount = +sellResult[0].totalCount;

            const [buyResult] = await sequelize.query(
                `SELECT SUM(unitPrice * quantity) AS totalPrice , SUM(quantity) AS totalCount FROM invoices , invoiceitems , stuffs
				WHERE invoiceId = invoices.id AND stuffId = stuffs.id AND type = 'buy' AND stuffId = ${id}`
            );
            const totalBuyPrice = +buyResult[0].totalPrice;
            const totalBuyCount = +buyResult[0].totalCount;

            res.success("عملیات با موفقیت انجام شد", {
                ...stuff,
                totalSellCount,
                totalSellPrice,
                totalBuyCount,
                totalBuyPrice,
            });
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }
}
