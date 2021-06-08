import { Component } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { Store } from '@ngrx/store';

import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';

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

  constructor(
    private pfDataGridStore: Store<fromPfDataGridReducer.State>
  ) {
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

  handleTabChange(activeTabId: any): void {
    let inboundFilters = StructuresPageConfig.CurrentModelsInboundFilters;
    if (activeTabId === StructuresPageConfig.ProposedModelsTabId) {
      inboundFilters = StructuresPageConfig.ProposedModelsInboundFilters;
    } else if (activeTabId === StructuresPageConfig.HistoricalModelsTabId) {
      inboundFilters = StructuresPageConfig.HistoricalModelsInboundFilters;
    }
    this.pfDataGridStore.dispatch(new fromPfDataGridActions.UpdateInboundFilters(this.pageViewId, inboundFilters, false));
  }
}
