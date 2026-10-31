import { DataTypes } from "@sequelize/core";
import sequelize from "../utils/db.js";

const InvoiceItem = sequelize.define(
    "InvoiceItem",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        unitPrice: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "وارد کردن قیمت واحد اجباری است",
                },
                rangeValidation(value) {
                    value = Number(value);
                    if (isNaN(value) || value !== parseInt(value)) {
                        throw new Error("قیمت کالا باید یک عدد صحیح باشد");
                    } else if (value > 4e9) {
                        throw new Error(`قیمت واحد نباید بزرگتر از ${formatPrice(4e9)} باشد`);
                    } else if (value < 0) {
                        throw new Error("قیمت واحد نباید منفی باشد");
                    }
                },
            },
        },
        quantity: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "وارد کردن تعداد کالا اجباری است",
                },
            },
        },
    },
    {
        timestamps: false,
        indexes: [
            {
                type: "unique",
                fields: ["stuffId", "invoiceId"],
                msg: "فاکتور نباید کالای تکراری داشته باشد",
            },
        ],
    }
);

export default InvoiceItem;
