export const prettyNum = (numb: number): string => numb.toFixed(2);

export const prettyUsd = (numb: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numb);
