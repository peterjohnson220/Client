export function isAscending(values: number[]): boolean {
  return values
    .slice(1)
    .every((num, i) => num !== null && values[i] !== null && num >= values[i]);
}

export function allEqual(values: number[]): boolean {
  return values.every((num) => num !== null && values[0] !== null && num === values[0]);
}
