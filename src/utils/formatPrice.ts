export const formatPrice = (
  value: number | string,
  currency: string = "ETB"
) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};
export const formatPriceWithDecimals = (
  value: number | string,
  currency: string = "ETB",
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2
) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericValue);
};
