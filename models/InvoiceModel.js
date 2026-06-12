import { DataTypes } from "@sequelize/core";
import sequelize from "../utils/db.js";
import InvoiceItem from "./InvoiceItemModel.js";

const Invoice = sequelize.define(
    "Invoice",
    {
        type: {
            type: DataTypes.ENUM("buy", "sell"),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "نوع فاکتور را مشخص کنید",
                },
                isNotValid(value) {
                    if (value !== "sell" && value !== "buy") {
                        throw new Error("نوع فاکتور نامعتبر است");
                    }
                },
            },
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "تاریخ فاکتور را مشخص کنید",
                },
                isNotValid(value) {
                    const d = new Date(value);
                    if (!d.getTime()) {
                        throw new Error("تاریخ وارد شده معتبر نیست");
                    }
                },
            },
        },
        invoiceNumber: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: {
                msg: "شماره فاکتور نمی‌تواند تکراری باشد",
            },
            validate: {
                notNull: {
                    msg: "شماره فاکتور را مشخص کنید",
                },
                rangeValidation(value) {
                    value = Number(value);
                    if (
                        isNaN(value) ||
                        value !== parseInt(value) ||
                        value > 9999999 ||
                        value < 1
                    ) {
                        throw new Error(
                            enToFa("شماره فاکتور باید یک عدد صحیح مثبت 1 تا 7 رقمی باشد")
                        );
                    }
                },
            },
        },
        description: {
            type: DataTypes.STRING(1000),
            defaultValue: "",
            validate: {
                isLong(value) {
                    if (value.length > 1000) {
                        throw new Error(enToFa("توضیحات نباید بیشتر از 1000 کاراکتر باشد"));
                    }
                },
            },
        },
        totalPrice: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
    },
    {
        timestamps: false,
    }
);

Invoice.prototype.updatePrice = async function () {
    const items = await InvoiceItem.findAll({ where: { invoiceId: this.id } });
    let totalPrice = 0;
    for (let item of items) {
        totalPrice += item.quantity * item.unitPrice;
    }
    this.totalPrice = totalPrice;
    await this.save();
};

export default Invoice;
