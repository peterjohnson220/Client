import { Filter, TextFilter } from '../models';

export function getCombinedScope(filters: Filter[]): string {
  const combinedScopeFilter = <TextFilter>filters.find(f => f.Id === 'scope');
  let combinedScope = null;
  if (combinedScopeFilter.Value) {
    combinedScope = combinedScopeFilter.Value;
  }
  return combinedScope;
}
