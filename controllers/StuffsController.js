import { Op } from "@sequelize/core";
import Stuff from "../models/StuffModel.js";
import { parseDBError } from "../utils/helperFunctions.js";
import Invoice from "../models/InvoiceModel.js";

export default class StuffsController {
    static async getStuffById(req, res) {
        const id = +req.params.id;

        try {
            const stuff = await Stuff.findByPk(id);
            if (stuff) {
                res.success("کالا با موفقیت خوانده شد", stuff);
            } else {
                res.fail("کالا یافت نشد", 404);
            }
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async getStuffs(req, res) {
        const limit = +(req.query.limit ?? DEFAULT_LIMIT);
        const page = +(req.query.page ?? 1);
        const q = req.query.q ?? "";
        const categoryId = +(req.query.categoryId ?? 0);

        const where = {
            [Op.or]: {
                title: {
                    [Op.like]: `%${q}%`,
                },
                description: {
                    [Op.like]: `%${q}%`,
                },
            },
        };
        if (categoryId) {
            where.categoryId = categoryId;
        }

        try {
            const { rows, count } = await Stuff.findAndCountAll({
                where,
                limit,
                offset: (page - 1) * limit,
            });

            res.success("کالاها با موفقیت خوانده شدند", {
                stuffs: rows,
                count,
            });
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async createStuff(req, res) {
        const { title, buyPrice, sellPrice, description, categoryId } = req.body;

        try {
            const stuff = await Stuff.create({
                title,
                buyPrice,
                sellPrice,
                description,
                categoryId,
            });
            res.success("کالا با موفقیت ایجاد شد", stuff, 201);
        } catch (e) {
            const error = parseDBError(e);
            res.fail(error.message, error.code);
        }
    }

    static async updateStuff(req, res) {
        const { title, buyPrice, sellPrice, description, categoryId } = req.body;
        const id = +req.params.id;

        try {
            const stuff = await Stuff.findByPk(id);
            if (!stuff) {
                return res.fail("کالا یافت نشد", 404);
            }
            await stuff.update({ title, buyPrice, sellPrice, description, categoryId });
            res.success("کالا با موفقیت بروز شد");
        } catch (e) {
            const error = parseDBError(e);
            res.fail(error.message, error.code);
        }
    }

    static async deleteStuff(req, res) {
        const id = +req.params.id;
        const forced = req.query.force === "true";

        try {
            const fullStuff = await Stuff.findByPk(id, { include: [Invoice] });
            if (fullStuff?.invoices?.length && !forced) {
                return res.fail("این کالا به دلیل استفاده شدن در فاکتورها قابل حذف نیست", 403);
            }
            const stuff = await Stuff.destroy({ where: { id } });
            if (stuff) {
                for (let invoice of fullStuff.invoices) {
                    await invoice.updatePrice();
                }
                res.success("کالا با موفقیت حذف شد");
            } else {
                res.fail("کالا یافت نشد", 404);
            }
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }
}
