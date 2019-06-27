import { FilterUppercase, generateMockFilterUppercase } from './filter-uppercase.model';

export class CompositeFilterUppercase {
  Logic: string;
  Filters: FilterUppercase[];
}

export function generateMockCompositeFilterUppercase(): CompositeFilterUppercase {
  return {
    Logic: 'Test Logic',
    Filters: [generateMockFilterUppercase()]
  };
}
