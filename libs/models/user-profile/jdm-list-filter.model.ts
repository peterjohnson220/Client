import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';

export interface JdmListFilter {
  Id: string;
  Name: string;
  CompositeFilter: CompositeFilterDescriptor;
}

export function generateMockJdmListFilter(mockField: string = 'Test Field'): JdmListFilter {
  return {
    Id: '1',
    Name: 'Test Name',
    CompositeFilter: generateMockCompositeFilter(mockField)
  };
}

export function generateMockCompositeFilter(mockField: string = 'Test Field'): CompositeFilterDescriptor {
  return {
    logic: 'and',
    filters: generateMockFilters(mockField)
  };
}

export function generateMockFilters(mockField: string = 'Test Field'): FilterDescriptor[] {
  return [generateMockFilter(1, mockField), generateMockFilter(2, mockField)];
}

export function generateMockFilter(filterNumber: number = 1, mockField: string = 'Test Field'): FilterDescriptor {
  return {
    field: `${mockField} ${filterNumber}`,
    operator: 'eq',
    value: `Test Value ${filterNumber}`,
    ignoreCase: false
  };
}
