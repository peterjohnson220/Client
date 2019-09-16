export class PfDataGridFieldModel {
  Visible: boolean;
  Field: string;
  DisplayName: string;
  Template: string;
  Default: boolean;
  Type: string;
  ChildColumns: string[];
  ShowInCompactView: boolean;
}

export function generateMockPfGridColumns(numberOfColumns: number = 2, startMockNumber: number = 1): PfDataGridFieldModel[] {
  const mockListAreaColumns = [];

  for (let i = 0; i < numberOfColumns; i++) {
    mockListAreaColumns.push(generateMockPfGridColumn(startMockNumber));

    startMockNumber++;
  }

  return mockListAreaColumns;
}

export function generateMockPfGridColumn(mockNumber: number = 1): PfDataGridFieldModel {
  return {
    Visible: true,
    Field: `TestMockField${mockNumber}`,
    DisplayName: `Test Mock Display Name ${mockNumber}`,
    Template: null,
    Default: false,
    Type: 'text',
    ChildColumns: [],
    ShowInCompactView: false
  };
}
