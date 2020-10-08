export interface ConverterSettings {
  connection_ID?: number;
  dataType: string;
  entityType: string;
  fieldName?: string;
  options: any;
}

export function generateMockConverterSettings(): ConverterSettings {
  return {
    dataType:  'Date',
    entityType: 'Employees',
    fieldName: null,
    options: {
      DateTimeFormat: 'yyyy-MM-ddzzz'
    }
  };
}
