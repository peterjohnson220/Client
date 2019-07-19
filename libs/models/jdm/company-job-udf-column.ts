export interface CompanyJobUdfColumn {
  DispName: string;
  ColumnName: string;
}

export function generateMockCompanyJobUdfColumn(): CompanyJobUdfColumn {
  return {
    DispName: 'Test Display Name',
    ColumnName: 'Test Column Name'
  };
}
