import { CompositeFilterDescriptor, FilterDescriptor, State } from '@progress/kendo-data-query';

export class KendoGridFilterHelper {

  // MOCKS
  static getMockGridState(columnName?: string, skip?: number): State {
    const field = columnName || 'test';
    return {
      skip: skip || 10,
      take: 10,
      filter: {
        filters: [{
          field: field,
          operator: 'contains',
          value: 'test'
        }],
        logic: 'and'
      },
      sort: [{field: field, dir: 'asc'}]
    };
  }
  static getMockFilter(columnName: string, operator?: string): FilterDescriptor {
    operator = operator || 'contains';
    return {
      operator: operator,
      field: columnName,
      value: 'test'
    };
  }
  static getMockEmptyGridState(): State {
    return {
      skip: 0,
      take: 10,
      filter: {
        filters: [],
        logic: 'and'
      },
      sort: []
    };
  }

  static updateFilter(columnName: string, value: string, operator: string, gridState: State): void {
    this.assumeCompositeFilter(gridState);
    const compositeFilter = gridState.filter;
    const filter: any = compositeFilter.filters.find((f: FilterDescriptor) => f.field === columnName);
    if (!filter) {
      this.addColumnFilter(columnName, value, operator, compositeFilter);
      return;
    }

    if (value && value.length > 0) {
      filter.value = value;
    } else {
      compositeFilter.filters = compositeFilter.filters.filter((f: FilterDescriptor) => f.field !== columnName);
    }
  }

  static clearFilters(gridState: State): void {
    if (!gridState.filter) {
      return;
    }

    gridState.filter.filters = [];
  }

  private static addColumnFilter(columnName: string, value: string, operator: string, compositeFilter: CompositeFilterDescriptor) {
    const hasValue = value && value.length > 0;
    if (!hasValue) {
      return;
    }

    const newFilter: FilterDescriptor = {
      operator: operator,
      field: columnName,
      value: value
    };
    compositeFilter.filters.push(newFilter);
  }

  private static assumeCompositeFilter(gridState: State) {
    if (!gridState.filter) {
      gridState.filter = {
        filters: [],
        logic: 'and'
      };
    }
  }
}
