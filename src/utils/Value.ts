export const isArrayNotEmpty = (value: unknown[] | null | undefined) => {
  return value !== null && value !== undefined && value.length > 0;
};

export const isAmount = (value: string) => {
  return value.match(/^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?$/) !== null;
};

export const parseAmount = (input: string) => {
  const defaultInput = input || "0";
  return parseFloat(defaultInput.replace(/[,]/g, ""));
};

export const formatAmount = (input: number | string) => {
  const value = typeof input === "number" ? input : parseAmount(input);
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[^0-9,.]/g, "");
};
