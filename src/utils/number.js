export function formatNumber(number, locale = "en-US", options = {}) {
    const result = new Intl.NumberFormat(locale, options).format(number);
    return result?.replace(",", ".");
}
