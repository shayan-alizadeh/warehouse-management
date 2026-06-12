import { Op } from "@sequelize/core";
import Person from "../models/PersonModel.js";
import Invoice from "../models/InvoiceModel.js";
import { parseDBError } from "../utils/helperFunctions.js";

export default class PeopleController {
    static async getPersonById(req, res) {
        const id = +req.params.id;

        try {
            const person = await Person.findByPk(id);
            if (person) {
                res.success("طرف حساب با موفقیت خوانده شد", person);
            } else {
                res.fail("طرف حساب یافت نشد", 404);
            }
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async getPeople(req, res) {
        const limit = +(req.query.limit ?? DEFAULT_LIMIT);
        const page = +(req.query.page ?? 1);
        const q = req.query.q ?? "";

        try {
            const { rows, count } = await Person.findAndCountAll({
                where: { fullname: { [Op.like]: `%${q}%` } },
                limit,
                offset: (page - 1) * limit,
            });

            res.success("طرف حساب‌ها با موفقیت خوانده شدند", {
                people: rows,
                count,
            });
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }

    static async createPerson(req, res) {
        const { fullname, phone, address } = req.body;

        try {
            const person = await Person.create({ fullname, phone, address });
            res.success("طرف حساب با موفقیت ایجاد شد", person, 201);
        } catch (e) {
            const error = parseDBError(e);
            res.fail(error.message, error.code);
        }
    }

    static async updatePerson(req, res) {
        const { fullname, phone, address } = req.body;
        const id = +req.params.id;

        try {
            const person = await Person.findByPk(id);
            if (!person) {
                return res.fail("طرف حساب یافت نشد", 404);
            }
            await person.update({ fullname, phone, address });
            res.success("طرف حساب با موفقیت بروز شد");
        } catch (e) {
            const error = parseDBError(e);
            res.fail(error.message, error.code);
        }
    }

    static async deletePerson(req, res) {
        const id = +req.params.id;
        const forced = req.query.force === "true";

        try {
            const invoice = await Invoice.findOne({ where: { personId: id } });
            if (invoice && !forced) {
                return res.fail(
                    "این طرف حساب دارای فاکتور ثبت شده است و قابل حذف نیست",
                    403
                );
            }
            const person = await Person.destroy({ where: { id } });
            if (person) {
                res.success("طرف حساب با موفقیت حذف شد");
            } else {
                res.fail("طرف حساب یافت نشد", 404);
            }
        } catch (e) {
            res.fail(DB_ERROR, 500);
        }
    }
}
