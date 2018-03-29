export enum SortDirection {
  Ascending = 'ASC',
  Descending = 'DESC'
}

export function arraySortByString(a: string, b: string, dir: SortDirection) {
  const nameA = a.toUpperCase();
  const nameB = b.toUpperCase();

  if (nameA < nameB) {
    return dir === SortDirection.Ascending ? -1 : 1;
  }
  if (nameA > nameB) {
    return SortDirection.Ascending ? 1 : -1;
  }

  return 0;
}
