import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { SortDescriptor } from '@progress/kendo-data-query';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  ActionBarConfig,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridConfig,
  GridRowActionsConfig,
  PfDataGridFilter
} from 'libs/features/grids/pf-data-grid/models';
import { GroupedListItem } from 'libs/models/list';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { Permissions } from 'libs/constants';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import { StructuresPageConfig } from '../models';
import * as fromStructuresPageReducer from '../reducers';
import * as fromStructuresPageActions from '../actions/structures-page.actions';
import * as fromDuplicateModelModalActions from '../../shared/actions/duplicate-model-modal.actions';
import * as fromSharedStructuresReducer from '../../shared/reducers';

@Component({
  selector: 'pf-structures-page',
  templateUrl: './structures.page.html',
  styleUrls: ['./structures.page.scss']
})
export class StructuresPageComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild('numericColumn') numericColumn: ElementRef;
  @ViewChild('payMarketFilter') payMarketFilter: ElementRef;
  @ViewChild('structureTypeFilter') structureTypeFilter: ElementRef;
  @ViewChild('currencyFilter') currencyFilter: ElementRef;

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
  filterTemplates = {};
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  payMarketField: ViewField;
  structuresTypeField: ViewField;
  currencyField: ViewField;
  structureTypes = [
    {Name: '', Value: null},
    {Name: 'Job Based Range', Value: 'Job'},
    {Name: 'Grade Based Range', Value: 'Grade'}
  ];
  payMarketOptions: GroupedListItem[];
  currencies: any;

  selectedPayMarkets: string[];
  selectedStructureType: any;
  selectedCurrency: any;

  selectedRangeGroupIdsSubscription: Subscription;
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  currencySubscription: Subscription;

  deleteStructureModalOpen$: Observable<boolean>;
  deleting$: Observable<boolean>;
  deletingError$: Observable<boolean>;
  colTemplates = {};

  constructor(
    private pfDataGridStore: Store<fromPfDataGridReducer.State>,
    private structuresStore: Store<fromStructuresPageReducer.State>,
    private sharedStructuresStore: Store<fromSharedStructuresReducer.State>
  ) {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true,
      AllowSaveFilter: true
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
    this.gridFieldSubscription = this.pfDataGridStore.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.payMarketField = fields.find(s => s.SourceName === 'PayMarket');
        this.structuresTypeField = fields.find(s => s.SourceName === 'RangeType');
        this.currencyField = fields.find(s => s.SourceName === 'Currency');
        this.selectedPayMarkets = this.payMarketField.FilterValues === null ? [] : this.payMarketField.FilterValues;
        this.selectedStructureType = this.structuresTypeField.FilterValues === null ? [] :
          this.structureTypes.find(x => x.Value === this.structuresTypeField.FilterValues[0]);
        this.selectedCurrency = this.currencyField.FilterValues === null ? [] :
          this.currencies.find(x => x.Value ===  this.currencyField.FilterValues[0]);
      }
    });
    this.companyPayMarketsSubscription = this.structuresStore.select(fromStructuresPageReducer.getCompanyPayMarkets).subscribe(pm => {
      if (!!pm.obj.length) {
        this.payMarketOptions = pm.obj;
      }
    });
    this.currencySubscription = this.structuresStore.select(fromStructuresPageReducer.getCurrencies).subscribe(currency => {
      if (!!currency.obj.length) {
        this.currencies = currency.obj;
      }
    });
    this.structuresStore.dispatch(new fromStructuresPageActions.LoadCurrencies());
    this.structuresStore.dispatch(new fromStructuresPageActions.LoadCompanyPayMarkets());
  }

  ngAfterViewInit(): void {
    this.gridRowActionsConfig = {
      ...this.gridRowActionsConfig,
      ActionsTemplate: this.gridRowActionsTemplate
    };
    this.colTemplates = {
      [PfDataGridColType.currency]: {Template: this.currencyColumn},
      ['numeric']: {Template: this.numericColumn}
    };
    this.filterTemplates = {
      'PayMarket': {Template: this.payMarketFilter},
      'RangeType': {Template: this.structureTypeFilter},
      'Currency': {Template: this.currencyFilter}
    };
  }

  ngOnDestroy(): void {
    this.selectedRangeGroupIdsSubscription.unsubscribe();
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
    this.currencySubscription.unsubscribe();
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

  handleDuplicateRangeGroupClicked (selectedRangeGroupId: number) {
    this.selectedRangeGroupId = selectedRangeGroupId;
    this.sharedStructuresStore.dispatch(new fromDuplicateModelModalActions.OpenModal());
  }

  handleModalDismissed(): void {
    this.deleteSingleRangeGroup = false;
    this.selectedRangeGroupId = null;
    this.structuresStore.dispatch(new fromStructuresPageActions.CloseDeletePayMarketModal());
  }

  handlePayMarketFilterChanged(payMarkets: GroupedListItem[]): void {
    const field: ViewField = cloneDeep(this.payMarketField);
    field.FilterValues = payMarkets?.length > 0 ? payMarkets.map(x => x.Value) : null;
    field.FilterOperator = 'in';
    this.updateField(field);
  }

  handleSingleValueChanged(item: GroupedListItem, filterField: ViewField): void {
    const field: ViewField = cloneDeep(filterField);
    field.FilterValues = !!item?.Value ? [item.Value] : null;
    field.FilterOperator = 'in';
    this.updateField(field);
  }

  updateField(field: ViewField) {
    if (field?.FilterValues?.length > 0) {
      this.pfDataGridStore.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.pfDataGridStore.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }
}
