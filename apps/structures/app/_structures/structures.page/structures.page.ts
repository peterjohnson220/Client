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
  GridRowActionsConfig, PfDataGridCustomFilterOptions,
  PfDataGridFilter
} from 'libs/features/grids/pf-data-grid/models';
import { GroupedListItem } from 'libs/models/list';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { Permissions } from 'libs/constants';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { PfSecuredResourceDirective } from 'libs/forms/directives';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';

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
  @ViewChild('gridGlobalActions', { static: true }) public gridGlobalActionsTemplate: ElementRef;
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('currencyTypeColumn') currencyTypeColumn: ElementRef;
  @ViewChild('numericColumn') numericColumn: ElementRef;
  @ViewChild('modelColumn') modelColumn: ElementRef;
  @ViewChild('payMarketFilter') payMarketFilter: ElementRef;
  @ViewChild('structureTypeFilter') structureTypeFilter: ElementRef;
  @ViewChild('currencyFilter') currencyFilter: ElementRef;
  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild(PfSecuredResourceDirective) pfSecuredResourceDirective: PfSecuredResourceDirective;

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
  hasDropdownOptions: boolean;

  selectedPayMarkets: string[];
  selectedStructureType: any;
  selectedCurrency: any;
  customFilterOptions$: Observable<PfDataGridCustomFilterOptions[]>;

  selectedRangeGroupIdsSubscription: Subscription;
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  currencySubscription: Subscription;

  deleteStructureModalOpen$: Observable<boolean>;
  deleting$: Observable<boolean>;
  deletingError$: Observable<boolean>;
  colTemplates = {};
  structuresGradeBasedRangeLandingPageEnabled: boolean;

  constructor(
    private pfDataGridStore: Store<fromPfDataGridReducer.State>,
    private structuresStore: Store<fromStructuresPageReducer.State>,
    private sharedStructuresStore: Store<fromSharedStructuresReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
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
    this.customFilterOptions$ = this.structuresStore.select(fromStructuresPageReducer.getCustomFilterOptions);
    this.structuresGradeBasedRangeLandingPageEnabled = this.featureFlagService.enabled(FeatureFlags.StructuresGradeBasedRangeLandingPage, false);
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
        this.payMarketOptions = pm.obj.map(o => ({ Name: o.PayMarket, Value: o.PayMarket }));
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
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };

    this.gridRowActionsConfig = {
      ...this.gridRowActionsConfig,
      ActionsTemplate: this.gridRowActionsTemplate
    };
    this.colTemplates = {
      [PfDataGridColType.currency]: {Template: this.currencyTypeColumn},
      ['numeric']: {Template: this.numericColumn},
      'Currency': {Template: this.currencyColumn},
      'RangeGroup_Name': {Template: this.modelColumn}
    };
    this.filterTemplates = {
      'PayMarket': {Template: this.payMarketFilter},
      'RangeType': {Template: this.structureTypeFilter},
      'Currency': {Template: this.currencyFilter}
    };
    setTimeout(() => {
      this.hasDropdownOptions = this.checkHasDropdownOptions([this.permissions.STRUCTURES_ADD_EDIT_DELETE, this.permissions.STRUCTURES_CREATE_EDIT_MODEL]);
    }, 0);
  }

  ngOnDestroy(): void {
    this.selectedRangeGroupIdsSubscription.unsubscribe();
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
    this.currencySubscription.unsubscribe();
  }

  customSortOptions = (previousSortDescriptor: SortDescriptor[], currentSortDescriptor: SortDescriptor[]): SortDescriptor[] => {
    const currencySortInfo = currentSortDescriptor.find(s => s.field === 'CompanyStructures_RangeGroup_Currency');
    if (currencySortInfo) {
      currentSortDescriptor.unshift({
        dir: currencySortInfo.dir,
        field: 'Currency_Currency_Name'
      });
    }
    return currentSortDescriptor;
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

  handleDeleteModelClicked(): void {
    this.deleteSingleRangeGroup = false;
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

  handleClearSelectionClicked(): void {
    this.pfDataGridStore.dispatch(new fromPfDataGridActions.ClearSelections(this.pageViewId));
  }

  handleSingleValueChanged(item: GroupedListItem, filterField: ViewField): void {
    const field: ViewField = cloneDeep(filterField);
    field.FilterValues = !!item?.Value ? [item.Value] : null;
    field.FilterOperator = 'in';
    this.updateField(field);
  }

  addNewStructure(): void {
    this.structuresStore.dispatch(new fromStructuresPageActions.ShowStructureForm(true));
  }

  updateField(field: ViewField) {
    if (field?.FilterValues?.length > 0) {
      this.pfDataGridStore.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.pfDataGridStore.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  checkHasDropdownOptions(permissions: string[]): boolean {
    if (this.pfSecuredResourceDirective) {
      return this.pfSecuredResourceDirective.doAuthorizeAny(permissions);
    }
  }

}
