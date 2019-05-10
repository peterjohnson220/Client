import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';

export interface JdmListFilter {
  Id: string;
  Name: string;
  CompositeFilter: CompositeFilterDescriptor;
}

export function generateMockJdmListFilter(): JdmListFilter {
  return {
    Id: '1',
    Name: 'Test Name',
    CompositeFilter: generateMockCompositeFilter()
  };
}

export function generateMockCompositeFilter(): CompositeFilterDescriptor {
  return {
    logic: 'and',
    filters: generateMockFilters()
  };
}

export function generateMockFilters(): FilterDescriptor[] {
  return [{
    field: 'Test Field 1',
    operator: 'eq',
    value: 'Test Value 1',
    ignoreCase: false
  }, {
    field: 'Test Field 2',
    operator: 'eq',
    value: 'Test Value 2',
    ignoreCase: false
  }];
}
