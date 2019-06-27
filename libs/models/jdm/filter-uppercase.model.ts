export class FilterUppercase {
  Field: string;
  Operator: string;
  Value: string;
  IgnoreCase: boolean;
}

export function generateMockFilterUppercase(): FilterUppercase {
  return {
    Field: 'Test Field',
    Operator: 'Test Operator',
    Value: 'Test Value',
    IgnoreCase: false,
  };
}
