import { DataTypes } from "@sequelize/core";
import sequelize from "../utils/db.js";

const Stuff = sequelize.define(
    "Stuff",
    {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            set(value) {
                if (value) {
                    this.setDataValue("title", String(value).trim());
                }
            },
            validate: {
                notNull: {
                    msg: "وارد کردن عنوان کالا اجباری است",
                },
                isShort(value) {
                    if (value.length < 3) {
                        throw new Error(enToFa("عنوان کالا باید حداقل 3 کاراکتر باشد"));
                    }
                },
                isLong(value) {
                    if (value.length > 60) {
                        throw new Error(enToFa("عنوان کالا نباید بیشتر از 60 کاراکتر باشد"));
                    }
                },
            },
        },
        buyPrice: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
            validate: {
                rangeValidation(value) {
                    value = Number(value);
                    if (isNaN(value) || value !== parseInt(value)) {
                        throw new Error("قیمت خرید باید یک عدد صحیح باشد");
                    } else if (value > 4e9) {
                        throw new Error(`قیمت خرید نباید بزرگتر از ${formatPrice(4e9)} باشد`);
                    } else if (value < 0) {
                        throw new Error("قیمت خرید نباید منفی باشد");
                    }
                },
            },
        },
        sellPrice: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
            validate: {
                rangeValidation(value) {
                    value = Number(value);
                    if (isNaN(value) || value !== parseInt(value)) {
                        throw new Error("قیمت فروش باید یک عدد صحیح باشد");
                    } else if (value > 4e9) {
                        throw new Error(`قیمت فروش نباید بزرگتر از ${formatPrice(4e9)} باشد`);
                    } else if (value < 0) {
                        throw new Error("قیمت فروش نباید منفی باشد");
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
    },
    {
        timestamps: false,
        tableName: "stuffs",
    }
);

export default Stuff;
