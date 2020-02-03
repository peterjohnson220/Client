export interface CompanyJobUdf {
  DispName: string;
  ColumnName: string;
}

export function generateMockCompanyJobUdf(): CompanyJobUdf {
  return {
    DispName: 'Test Display Name',
    ColumnName: 'Test Column Name'
  };
}
