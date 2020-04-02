import { DataStateChangeEvent, RowArgs, SelectionEvent } from '@progress/kendo-angular-grid';

export function generateMockDataStateChangeEvent(sortField: string): DataStateChangeEvent {
  return {
    filter: {filters: [], logic: 'and'},
    group: null,
    skip: 0,
    take: 10,
    sort: [
      {field: sortField, dir: 'desc'}
    ]
  };
}

export function generateMockSelectionEvent(dataItem: any): SelectionEvent {
  return {
    selectedRows: [{dataItem: dataItem} as RowArgs],
    deselectedRows: [],
    ctrlKey: false,
    shiftKey: false
  };
}
