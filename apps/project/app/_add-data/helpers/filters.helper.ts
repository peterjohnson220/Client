import {Filter} from '../models';

export function getCombinedScope(filters: Filter[]): string {
  const combinedScopeFilter = filters.find(x => x.id === 'scope');
  let combinedScope = null;
  if (combinedScopeFilter.values.length) {
    combinedScope = combinedScopeFilter.values[0];
  }
  return combinedScope;
}
