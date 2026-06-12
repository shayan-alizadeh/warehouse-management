import { DataTypes } from "@sequelize/core";
import sequelize from "../utils/db.js";
import { slugify } from "../utils/helperFunctions.js";

const Category = sequelize.define(
    "Category",
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
                    msg: "وارد کردن عنوان دسته اجباری است",
                },
                isShort(value) {
                    if (value.length < 2) {
                        throw new Error(enToFa("عنوان دسته باید حداقل 2 کاراکتر باشد"));
                    }
                },
                isLong(value) {
                    if (value.length > 30) {
                        throw new Error(
                            enToFa("عنوان دسته نباید بیشتر از 30 کاراکتر باشد")
                        );
                    }
                },
            },
        },
        slug: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: {
                msg: "اسلاگ دسته نمی‌تواند تکراری باشد",
            },
            set(value) {
                if (value) {
                    this.setDataValue("slug", slugify(value));
                }
            },
            validate: {
                notNull: {
                    msg: "وارد کردن اسلاگ دسته اجباری است",
                },
                isShort(value) {
                    if (value.length < 2) {
                        throw new Error(enToFa("اسلاگ دسته باید حداقل 2 کاراکتر باشد"));
                    }
                },
                isLong(value) {
                    if (value.length > 30) {
                        throw new Error(
                            enToFa("اسلاگ دسته نباید بیشتر از 30 کاراکتر باشد")
                        );
                    }
                },
            },
        },
    },
    {
        timestamps: false,
    }
);

export default Category;
