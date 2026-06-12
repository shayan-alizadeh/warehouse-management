import Category from "./CategoryModel.js";
import Stuff from "./StuffModel.js";
import Person from "./PersonModel.js";
import Invoice from "./InvoiceModel.js";
import InvoiceItem from "./InvoiceItemModel.js";

Category.hasMany(Stuff, {
    foreignKey: {
        allowNull: false,
        validate: { notNull: { msg: "وارد کردن دسته کالا اجباری است" } },
    },
});

Person.hasMany(Invoice, {
    foreignKey: {
        allowNull: false,
        validate: { notNull: { msg: "وارد کردن طرف حساب فاکتور اجباری است" } },
    },
});

Stuff.belongsToMany(Invoice, {
    through: InvoiceItem,
    foreignKey: { validate: { notNull: { msg: "وارد کردن شناسه کالا اجباری است" } } },
    otherKey: { validate: { notNull: { msg: "وارد کردن شناسه فاکتور اجباری است" } } },
    inverse: { as: "stuffs" },
});
