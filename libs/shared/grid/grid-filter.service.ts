import { CompositeFilterDescriptor, FilterDescriptor, State } from '@progress/kendo-data-query';

export class GridFilterService {
  static updateFilter(columnName: string, value: string, gridState: State): void {
    this.assumeCompositeFilter(gridState);
    const compositeFilter = gridState.filter;
    const filter: any = compositeFilter.filters.find((f: FilterDescriptor) => f.field === columnName);
    if (!filter) {
      this.addColumnFilter(columnName, value, compositeFilter);
      return;
    }

    if (value && value.length > 0) {
      filter.value = value;
    } else {
      compositeFilter.filters = compositeFilter.filters.filter((f: FilterDescriptor) => f.field !== columnName);
    }
  }

  private static addColumnFilter(columnName: string, value: string, compositeFilter: CompositeFilterDescriptor) {
    const hasValue = value && value.length > 0;
    if (!hasValue) {
      return;
    }

    const newFilter: FilterDescriptor = {
      operator: 'contains',
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
