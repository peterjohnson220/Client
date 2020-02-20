export interface ListAreaColumn {
  ListAreaColumnId: number;
  ColumnDatabaseName: string;
  ColumnDisplayName: string;
  ColumnDataType: string;
  Visible: boolean;
  Order: number;
  Default: boolean;
  Required: boolean;
  DisableDropdown: boolean;
  PublicView: boolean;
}

export function generateMockListAreaColumns(numberOfColumns: number = 2, startMockNumber: number = 1): ListAreaColumn[] {
  const mockListAreaColumns = [];

  for (let i = 0; i < numberOfColumns; i++) {
    mockListAreaColumns.push(generateMockListAreaColumn(startMockNumber));

    startMockNumber++;
  }

  return mockListAreaColumns;
}

export function generateMockListAreaColumn(mockNumber: number = 1): ListAreaColumn {
  return {
    ListAreaColumnId: mockNumber,
    ColumnDatabaseName: `Test Column Database Name ${mockNumber}`,
    ColumnDisplayName: `Test Column Display Name ${mockNumber}`,
    ColumnDataType: `Test Column Data Type ${mockNumber}`,
    Visible: false,
    Order: 1,
    Default: false,
    Required: false,
    DisableDropdown: false,
    PublicView: true
  };
}
