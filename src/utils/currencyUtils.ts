import { Country, Currency } from "../client";

export type CurrencyCode = "USD" | "COP" | "MXN" | "EUR";

export const currencyLocales: Record<CurrencyCode, string> = {
  USD: "en-US",
  COP: "es-CO",
  MXN: "es-MX",
  EUR: "de-DE",
};

export const formatCurrency = (
  amount: string | number,
  currencyCode: CurrencyCode,
  showSymbol: boolean = false,
): string => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return "0.00";
  }

  const formatter = new Intl.NumberFormat(currencyLocales[currencyCode], {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return showSymbol
    ? formatter.format(numericAmount)
    : formatter.format(numericAmount).replace(currencyCode, "").trim();
};

const CURRENCY: Record<string, Currency> = {
  EUR: "EUR",
  USD: "USD",
  COP: "COP",
  MXN: "MXN",
  BRL: "BRL",
  ARS: "ARS",
  PAN: "USD",
} as const;

export const CURRENCY_BY_COUNTRY: Record<Country, Currency> = {
  COL: CURRENCY.COP,
  MEX: CURRENCY.MXN,
  BRA: CURRENCY.BRL,
  ARG: CURRENCY.ARS,
  USA: CURRENCY.USD,
  PAN: CURRENCY.USD,
};
