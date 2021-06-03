import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';

export class StructuresPageConfig {
  public static StructuresPageViewId = '28DD693A-A42C-44DF-B2E3-20250CD011AB';

  public static CurrentModelsInboundFilters: PfDataGridFilter[] = [
    {
      SourceName: 'IsCurrent',
      Operator: '=',
      ExcludeFromFilterSave: true,
      Values: ['1']
    },
    {
      SourceName: 'IsPublished',
      Operator: '=',
      ExcludeFromFilterSave: true,
      Values: ['1']
    }
  ];
}
