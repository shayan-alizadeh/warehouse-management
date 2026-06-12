import { DataTypes } from "@sequelize/core";
import sequelize from "../utils/db.js";

const Person = sequelize.define(
    "Person",
    {
        fullname: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: {
                msg: "نام طرف حساب نباید تکراری باشد",
            },
            set(value) {
                if (value) {
                    this.setDataValue("fullname", String(value).trim());
                }
            },
            validate: {
                notNull: {
                    msg: "وارد کردن نام طرف حساب اجباری است",
                },
                isShort(value) {
                    if (value.length < 3) {
                        throw new Error(enToFa("نام طرف حساب باید حداقل 3 کاراکتر باشد"));
                    }
                },
                isLong(value) {
                    if (value.length > 40) {
                        throw new Error(enToFa("نام طرف حساب نباید بیشتر از 40 کاراکتر باشد"));
                    }
                },
            },
        },
        phone: {
            type: DataTypes.STRING(15),
            defaultValue: "",
            set(value) {
                if (value) {
                    this.setDataValue("phone", String(value).trim());
                } else {
                    this.setDataValue("phone", "");
                }
            },
            validate: {
                isNotValid(value) {
                    if (value && !/^[0-9-]{3,15}$/.test(value)) {
                        throw new Error("شماره تلفن را درست وارد کنید");
                    }
                },
            },
        },
        address: {
            type: DataTypes.STRING(500),
            defaultValue: "",
            validate: {
                isLong(value) {
                    if (value.length > 500) {
                        throw new Error(enToFa("آدرس طرف حساب نباید بیشتر از 500 کاراکتر باشد"));
                    }
                },
            },
        },
    },
    {
        timestamps: false,
    }
);

export default Person;
