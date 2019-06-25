export function getValueForSortByProperty(entity: any, field: string) {

  if (!entity[field]) {
    return '';
  }
  if (typeof entity[field] === 'number') {
    return entity[field];
  }

  return entity[field].trim().toLowerCase();
}
