export function slugify(str) {
    return String(str)
        .trim()
        .replaceAll(" ", "-")
        .replaceAll(/-+/g, "-")
        .replaceAll(/[!@#$%^&*+=/\\;:'"|<>(){}[\],?،؟]/g, "")
        .toLowerCase();
}

export function parseDBError(e) {
    if (e?.cause?.errno === 1062) {
        const err = e.errors[0];
        return { message: err.message, code: 409 };
    } else if (e?.cause?.errno === 1452) {
        if (e.table === "categories") {
            return { message: `دسته ای با شناسه ${e.value} وجود ندارد`, code: 404 };
        } else if (e.table === "people") {
            return { message: `طرف حسابی با شناسه ${e.value} وجود ندارد`, code: 404 };
        } else if (e.table === "stuffs") {
            // چون کالاها به صورت یکجا درج شده اند، دقیقا معلوم نیست که کد کدام کالا نامعتبر است
            return { message: "شناسه یکی از کالاها معتبر نیست", code: 404 };
        }
    } else if (e.errors) {
        const err = e.errors.pop();
        if (err?.errors) {
            // برای زمانی که قیمت واحد یکی از آیتمها اشتباه باشد
            // یا شناسه یکی از کالاها وارد نشده باشد
            return { message: err.errors.errors[0].message, code: 400 };
        } else {
            return { message: err.message, code: 400 };
        }
    }
    return { message: DB_ERROR, code: 500 };
}
