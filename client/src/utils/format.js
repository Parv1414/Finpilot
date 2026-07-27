export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '';
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
};
