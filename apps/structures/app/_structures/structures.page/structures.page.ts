import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import {
  ActionBarConfig,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridConfig,
  GridRowActionsConfig,
  PfDataGridFilter
} from 'libs/features/grids/pf-data-grid/models';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { Permissions } from 'libs/constants';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import { StructuresPageConfig } from '../models';
import * as fromStructuresPageReducer from '../reducers';
import * as fromStructuresPageActions from '../actions/structures-page.actions';

@Component({
  selector: 'pf-structures-page',
  templateUrl: './structures.page.html',
  styleUrls: ['./structures.page.scss']
})
export class StructuresPageComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;

  pageViewId = StructuresPageConfig.StructuresPageViewId;
  inboundFilters: PfDataGridFilter[] = StructuresPageConfig.CurrentModelsInboundFilters;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyStructures_Structure_Name'
  }];
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  activeTab = 'current-models';
  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();
  permissions = Permissions;
  deleteSingleRangeGroup = false;
  selectedRangeGroupIds: number[];
  selectedRangeGroupId: number;
  selectedStructureName: string;

  selectedRangeGroupIdsSubscription: Subscription;

  deleteStructureModalOpen$: Observable<boolean>;
  deleting$: Observable<boolean>;
  deletingError$: Observable<boolean>;

  constructor(
    private pfDataGridStore: Store<fromPfDataGridReducer.State>,
    private structuresStore: Store<fromStructuresPageReducer.State>
  ) {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: true,
      ScrollToTop: true,
      SelectAllPanelItemName: 'Models'
    };
    this.deleteStructureModalOpen$ = this.structuresStore.select(fromStructuresPageReducer.getDeleteStructureModalOpen);
    this.deleting$ = this.structuresStore.pipe(select(fromStructuresPageReducer.getDeletingStructureStatus));
    this.deletingError$ = this.structuresStore.pipe(select(fromStructuresPageReducer.getDeletingStructureErrorStatus));
  }

  ngOnInit(): void {
    this.selectedRangeGroupIdsSubscription = this.pfDataGridStore.select(fromPfGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedRangeGroupIds = sk;
    });
  }

  ngAfterViewInit(): void {
    this.gridRowActionsConfig = {
      ...this.gridRowActionsConfig,
      ActionsTemplate: this.gridRowActionsTemplate
    };
  }

  ngOnDestroy(): void {
    this.selectedRangeGroupIdsSubscription.unsubscribe();
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

  handleDeleteSingleRangeGroupClicked(selectedRangeGroupId: number, selectedStructureName: string) {
    this.selectedRangeGroupId = selectedRangeGroupId;
    this.selectedStructureName = selectedStructureName;
    this.deleteSingleRangeGroup = true;
    this.structuresStore.dispatch(new fromStructuresPageActions.OpenDeletePayMarketModal());
  }

  handleStructureModelDelete(): void {
    if (this.deleteSingleRangeGroup) {
      this.structuresStore.dispatch(new fromStructuresPageActions.DeleteStructureModel({
        pageViewId: this.pageViewId,
        rangeGroupIds: [this.selectedRangeGroupId]
      }));
    } else {
      this.structuresStore.dispatch(new fromStructuresPageActions.DeleteStructureModel({
        pageViewId: this.pageViewId,
        rangeGroupIds: this.selectedRangeGroupIds
      }));
    }
  }

  handleModalDismissed(): void {
    this.deleteSingleRangeGroup = false;
    this.selectedRangeGroupId = null;
    this.structuresStore.dispatch(new fromStructuresPageActions.CloseDeletePayMarketModal());
  }
}
