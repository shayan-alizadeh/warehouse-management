globalThis.enToFa = (str) => {
    str = String(str);
    let fa = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    let en = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (let i = 0; i < 10; i++) {
        str = str.replaceAll(en[i], fa[i]);
    }
    return str;
};

globalThis.faToEn = (str) => {
    str = String(str);
    let fa = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    let en = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (let i = 0; i < 10; i++) {
        str = str.replaceAll(fa[i], en[i]);
    }
    return str;
};

globalThis.formatPrice = (amount) => {
    amount = faToEn(amount);
    let decimalCount = 0;
    let thousands = ",";
    let decimal = ".";
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return enToFa(
        negativeSign +
            (j ? i.substring(0, j) + thousands : "") +
            i.substring(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
            (decimalCount
                ? decimal +
                  Math.abc(amount - i)
                      .toFixed(decimalCount)
                      .slice(2)
                : "")
    );
};

globalThis.isPositiveInt = (value) => {
    value = +value;
    if (isNaN(value) || parseInt(value) !== value || value < 1) {
        return false;
    }
    return true;
};
