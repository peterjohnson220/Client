import { Component } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';

import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';

import { StructuresPageConfig } from '../models';

@Component({
  selector: 'pf-structures-page',
  templateUrl: './structures.page.html',
  styleUrls: ['./structures.page.scss']
})
export class StructuresPageComponent {
  pageViewId = StructuresPageConfig.StructuresPageViewId;
  inboundFilters: PfDataGridFilter[] = StructuresPageConfig.CurrentModelsInboundFilters;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyStructures_Structure_Name'
  }];
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  activeTab = 'current-models';

  constructor() {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
  }
}
