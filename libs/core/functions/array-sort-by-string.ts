export enum SortDirection {
  Ascending = 'ASC',
  Descending = 'DESC'
}

export function arraySortByString(a: string, b: string, dir: SortDirection) {
  if (!a && !b) {
    return dir === SortDirection.Ascending ? 1 : -1;
  }

  if (!b) {
    return dir === SortDirection.Ascending ? -1 : 1;
  }
  if (!a) {
    return dir === SortDirection.Ascending ? 1 : -1;
  }
  const nameA = a.toUpperCase();
  const nameB = b.toUpperCase();

  if (nameA < nameB) {
    return dir === SortDirection.Ascending ? -1 : 1;
  }
  if (nameA > nameB) {
    return dir === SortDirection.Ascending ? 1 : -1;
  }



  return 0;
}
