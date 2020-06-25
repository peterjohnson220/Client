export class JobDescriptionAppliesToItem {
  DisplayName: string;
  ColumnName: string;
  Source: string;
}


export function generateMockJobDescriptionAppliesToItem(): JobDescriptionAppliesToItem {
  return {
    DisplayName: 'Test Display Name',
    ColumnName: 'Test Column Name',
    Source: 'Test Source'
  };
}
