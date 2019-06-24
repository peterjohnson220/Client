export interface DataListItem {
  Id: number;
  Name: string;
  Selected: boolean;
}

export function generateMockDataListItem(): DataListItem {
  return {
    Id: 1001,
    Name: 'Data List Item',
    Selected: true
  };
}
