import { Op } from "@sequelize/core";
import Category from "../models/CategoryModel.js";
import Stuff from "../models/StuffModel.js";
import { parseDBError } from "../utils/helperFunctions.js";

export default class CategoriesController {
    static async getCategoryById(req, res) {
        const id = +req.params.id;

        try {
            const cat = await Category.findByPk(id);
            if (cat) {
                res.success("دسته با موفقیت خوانده شد", cat);
            } else {
                res.fail("دسته یافت نشد", 404);
            }
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async getCategories(req, res) {
        const limit = +(req.query.limit ?? DEFAULT_LIMIT);
        const page = +(req.query.page ?? 1);
        const q = req.query.q ?? "";

        try {
            const { rows, count } = await Category.findAndCountAll({
                where: {
                    [Op.or]: {
                        title: {
                            [Op.like]: `%${q}%`,
                        },
                        slug: {
                            [Op.like]: `%${q}%`,
                        },
                    },
                },
                limit,
                offset: (page - 1) * limit,
            });

            res.success("دسته‌ها با موفقیت خوانده شدند", {
                categories: rows,
                count,
            });
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async createCategory(req, res) {
        const { title, slug } = req.body;

        try {
            const cat = await Category.create({ title, slug });
            res.success("دسته با موفقیت ایجاد شد", cat, 201);
        } catch (e) {
            const error = parseDBError(e);
            res.fail(error.message, error.code);
        }
    }

    static async updateCategory(req, res) {
        const { title, slug } = req.body;
        const id = +req.params.id;

        try {
            const cat = await Category.findByPk(id);
            if (!cat) {
                return res.fail("دسته یافت نشد", 404);
            }
            await cat.update({ title, slug });
            res.success("دسته با موفقیت بروز شد");
        } catch (e) {
            const error = parseDBError(e);
            res.fail(error.message, error.code);
        }
    }

    static async deleteCategory(req, res) {
        const id = +req.params.id;
        const forced = req.query.force === "true";

        try {
            const stuff = await Stuff.findOne({ where: { categoryId: id } });
            if (stuff && !forced) {
                return res.fail("این دسته دارای کالا است و قابل حذف نیست", 403);
            }
            const cat = await Category.destroy({ where: { id } });
            if (cat) {
                res.success("دسته با موفقیت حذف شد");
            } else {
                res.fail("دسته یافت نشد", 404);
            }
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }
}
