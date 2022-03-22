import { BigNumber } from "bignumber.js";

function numberWithCommas(x: number) {
  var parts = x.toString().split(".");
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parts[1] ? "." + parts[1] : "")
  );
}

export const formatDecimal = (
  value: string | number | BigNumber,
  decimal: number = 18,
  numPoint: number = 4,
  precision: number = 2
) => {
  const data = new BigNumber(value).dividedBy(new BigNumber(10).pow(decimal));
  if (data.isGreaterThan(1)) {
    return numberWithCommas(data.dp(precision, 1).toNumber());
  }
  return data.dp(numPoint, 1).toNumber();
};
