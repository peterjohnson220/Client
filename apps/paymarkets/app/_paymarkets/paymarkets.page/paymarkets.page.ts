import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';

import { ActionBarConfig,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridConfig,
  GridRowActionsConfig,
  PfDataGridCustomFilterOptions
} from 'libs/features/grids/pf-data-grid/models';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';
import { Permissions } from 'libs/constants';
import { AsyncStateObj } from 'libs/models/state';
import { GroupedListItem } from 'libs/models/list';
import * as fromPayMarketManagementReducers from 'libs/features/paymarkets/paymarket-management/reducers';
import * as fromPayMarketModalActions from 'libs/features/paymarkets/paymarket-management/actions/paymarket-modal.actions';
import { PfSecuredResourceDirective } from 'libs/forms/directives';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import * as fromLayoutWrapperReducer from 'libs/ui/layout-wrapper/reducers';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { DataViewConfig, ViewField } from 'libs/models/payfactors-api/reports/request';

import * as fromPayMarketsPageActions from '../actions/paymarkets-page.actions';
import * as fromGridActionsBarActions from '../actions/grid-actions-bar.actions';
import * as fromPayMarketsPageReducer from '../reducers';
import { PayMarketsPageViewId, PayMarketCustomDisplayFilters } from '../models';

@Component({
  selector: 'pf-paymarkets-page',
  templateUrl: './paymarkets.page.html',
  styleUrls: ['./paymarkets.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayMarketsPageComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('payMarketNameColumn') payMarketNameColumn: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) public gridGlobalActionsTemplate: ElementRef;
  @ViewChild('industryFilter') industryFilter: ElementRef;
  @ViewChild('sizeFilter') sizeFilter: ElementRef;
  @ViewChild('locationFilter') locationFilter: ElementRef;
  @ViewChild(PfSecuredResourceDirective) pfSecuredResourceDirective: PfSecuredResourceDirective;

  industries$: Observable<AsyncStateObj<GroupedListItem[]>>;
  sizes$: Observable<AsyncStateObj<GroupedListItem[]>>;
  locations$: Observable<AsyncStateObj<GroupedListItem[]>>;

  identity$: Observable<UserContext>;
  isTileView$: Observable<string>;
  leftSidebarOpen$: Observable<boolean>;
  customFilterOptions$: Observable<PfDataGridCustomFilterOptions[]>;

  identitySubscription: Subscription;
  isTileViewSubscription: Subscription;
  leftSidebarOpenSubscription: Subscription;
  gridFieldSubscription: Subscription;
  savedViewsFieldsSubscription: Subscription;

  defaultSort: SortDescriptor[] = [
    {
      dir: 'desc',
      field: 'CompanyPayMarkets_IsDefaultPayMarket'
    },
    {
      dir: 'asc',
      field: 'CompanyPayMarkets_PayMarket'
    }
  ];
  selectedIndustries: string[];
  selectedSize: string[];
  selectedLocation: string[];
  industryField: ViewField;
  sizeField: ViewField;
  locationField: ViewField;

  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  pageViewId = PayMarketsPageViewId;
  companyId: number;
  filterTemplates = {};
  colTemplates = {};
  defaultPayMarketId: number;
  selectedPayMarketId: number;
  selectedPayMarketName: string;
  selectedPopover: NgbDropdown;
  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();
  permissions = Permissions;
  showSummaryModal = new BehaviorSubject<boolean>(false);
  showSummaryModal$ = this.showSummaryModal.asObservable();
  summaryPaymarketId: number;
  isTileView: boolean;
  isLeftSidebarOpened: boolean;
  tileView = 'Tile View';
  listView = 'List View';
  customDisplayFilters = ['Industry_Value', 'Geo_Value'];

  constructor(
    private store: Store<fromPayMarketsPageReducer.State>,
    private userContextStore: Store<fromRootState.State>,
    public payMarketManagementStore: Store<fromPayMarketManagementReducers.State>,
    private layoutWrapperStore: Store<fromLayoutWrapperReducer.State>,
    private settingsService: SettingsService,
    private changeDetectorRef: ChangeDetectorRef,
    private actionsSubject: ActionsSubject
  ) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.industries$ = this.store.select(fromPayMarketsPageReducer.getCompanyIndustries);
    this.sizes$ = this.store.select(fromPayMarketsPageReducer.getCompanyScopeSizes);
    this.locations$ = this.store.select(fromPayMarketsPageReducer.getLocations);
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      ShowFilterChooser: true,
      AllowSaveFilter: true
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
    this.isTileView$ = this.settingsService.selectUiPersistenceSetting<string>(
      FeatureAreaConstants.PayMarkets, UiPersistenceSettingConstants.PayMarketsPageViewStyleSelection, 'string'
    );
    this.leftSidebarOpen$ = this.layoutWrapperStore.select(fromLayoutWrapperReducer.getLeftSidebarOpen);
    this.customFilterOptions$ = this.store.select(fromPayMarketsPageReducer.getCustomFilterOptions);
  }

  ngOnInit() {
    this.identitySubscription = this.identity$.subscribe(i => {
      if (!!i) {
        this.defaultPayMarketId = i.DefaultPayMarketId;
        this.companyId =  i.CompanyId;
      }
    });
    this.isTileViewSubscription = this.isTileView$.subscribe(value => {
      this.isTileView = value === this.tileView || (value === null);
      this.changeDetectorRef.detectChanges();
    });
    this.leftSidebarOpenSubscription = this.leftSidebarOpen$.subscribe(isOpen => {
      if (isOpen !== null) {
        this.isLeftSidebarOpened = isOpen;
      }
    });
    this.store.dispatch(new fromGridActionsBarActions.GetCompanyIndustries());
    this.store.dispatch(new fromGridActionsBarActions.GetCompanyScopeSizes());
    this.store.dispatch(new fromGridActionsBarActions.GetLocations());
    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.industryField = fields.find(f => f.SourceName === 'Industry_Value');
        this.sizeField = fields.find(f => f.SourceName === 'ScopeSize');
        this.locationField = fields.find(f => f.SourceName === 'Geo_Value');
        this.selectedIndustries = this.industryField.FilterValues === null ? [] : this.industryField.FilterValues;
        this.selectedSize = this.sizeField.FilterValues === null ? [] : this.sizeField.FilterValues;
        this.selectedLocation = this.locationField.FilterValues === null ? [] : this.locationField.FilterValues;
      }
    });
    this.savedViewsFieldsSubscription = this.actionsSubject
      .pipe(ofType(fromPfDataGridActions.LOAD_SAVED_VIEWS_SUCCESS))
      .subscribe((action: fromPfDataGridActions.LoadSavedViewsSuccess) => {
        if (action.pageViewId === this.pageViewId && action.payload?.length) {
          this.initSavedViewsCustomDisplayOptions(action.payload);
        }
      });
    window.addEventListener('scroll', this.scroll, true);
  }

  ngAfterViewInit(): void {
    this.gridRowActionsConfig = {
      ...this.gridRowActionsConfig,
      ActionsTemplate : this.gridRowActionsTemplate
    };
    this.colTemplates = {
      'PayMarket': { Template: this.payMarketNameColumn}
    };
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
    this.filterTemplates = {
      'Industry_Value': { Template: this.industryFilter},
      'ScopeSize': { Template: this.sizeFilter},
      'Geo_Value': { Template: this.locationFilter}
    };
  }

  ngOnDestroy() {
    this.identitySubscription.unsubscribe();
    this.isTileViewSubscription.unsubscribe();
    this.leftSidebarOpenSubscription.unsubscribe();
    this.gridFieldSubscription.unsubscribe();
  }

  customSortOptions = (previousSortDescriptor: SortDescriptor[], currentSortDescriptor: SortDescriptor[]): SortDescriptor[] => {
    if (currentSortDescriptor && currentSortDescriptor.length > 0) {
      const sizeSortInfo = currentSortDescriptor.find(s => s.field === 'CompanyPayMarkets_ScopeSize');
      if (sizeSortInfo) {
        currentSortDescriptor = this.getSizeColumnSort(sizeSortInfo);
      }
      if (!currentSortDescriptor.some(s => s.field === 'CompanyPayMarkets_IsDefaultPayMarket')) {
        currentSortDescriptor.unshift({
          dir: 'desc',
          field: 'CompanyPayMarkets_IsDefaultPayMarket'
        });
      }
    }
    return currentSortDescriptor;
  }

  handleIndustryFilterChanged(values: GroupedListItem[]) {
    this.store.dispatch(new fromGridActionsBarActions.SetSelectedIndustries(values));
  }

  handleSelectedSizesChanged(sizesStates: GroupedListItem[]): void {
    this.store.dispatch(new fromGridActionsBarActions.UpdateSelectedSizes(sizesStates));
  }

  handleLocationFilterChanged(values: GroupedListItem[]): void {
    this.store.dispatch(new fromGridActionsBarActions.SetSelectedLocations(values));
  }

  handleSelectedRowAction(payMarketId: number, payMarketName: string, popover: any) {
    this.selectedPayMarketId = payMarketId;
    this.selectedPayMarketName = payMarketName;
    this.selectedPopover = popover;
  }

  handleDeleteModalClose(): void {
    this.selectedPayMarketId = null;
  }

  setDefaultPayMarket(payMarketId: number) {
    if (!!payMarketId) {
      this.defaultPayMarketId = payMarketId;
      this.store.dispatch(new fromPayMarketsPageActions.SetDefaultPayMarket(payMarketId));
    }
  }

  editPayMarket(payMarketId: number): void {
    this.payMarketManagementStore.dispatch(new fromPayMarketModalActions.OpenPayMarketModal({ payMarketId }));
  }

  scroll = (): void => {
    if (!!this.selectedPopover) {
      this.selectedPopover.close();
    }
  }

  addNewPayMarket(): void {
    this.payMarketManagementStore.dispatch(new fromPayMarketModalActions.OpenPayMarketModal());
  }

  viewSummary(payMarketId: number): void {
    this.showSummaryModal.next(true);
    this.summaryPaymarketId = payMarketId;
  }

  closeSummaryModal(): void {
    this.showSummaryModal.next(false);
    this.summaryPaymarketId = null;
  }

  deletePayMarket(): void {
    this.payMarketManagementStore.dispatch(new fromPayMarketModalActions.OpenDeletePayMarketModal());
  }

  toggleView(): void {
    const viewName = this.isTileView ? this.listView : this.tileView;
    this.store.dispatch(new fromPayMarketsPageActions.SavePageViewStyle(viewName));
  }

  private getSizeColumnSort(sizeSortInfo: SortDescriptor): SortDescriptor[] {
    return [
      {
        field: 'CompanyPayMarkets_Size_Label',
        dir: sizeSortInfo.dir
      },
      {
        field: 'CompanyPayMarkets_Size_Id',
        dir: sizeSortInfo.dir
      },
      {
        field: 'CompanyPayMarkets_ScopeSize',
        dir: sizeSortInfo.dir
      }
    ];
  }
  private hasDropdownOptions(isDefaultPayMarket: boolean, permission: string): boolean {
    return !(!this.pfSecuredResourceDirective.doAuthorize(permission) && isDefaultPayMarket);
  }

  private initSavedViewsCustomDisplayOptions(views: DataViewConfig[]): void {
    const customFilters: PayMarketCustomDisplayFilters = {
      Industry_Value: [],
      Geo_Value: []
    };
    views.forEach(view => {
      const filters = view.Fields.filter(field => field.FilterOperator && field.FilterValues !== null && !field.IsGlobalFilter);
      if (filters) {
        filters.forEach(filter => {
          if (this.customDisplayFilters.indexOf(filter.SourceName) > -1) {
            this.addFilterValuesToGroupListItems(customFilters, filter.SourceName, filter.FilterValues);
          }
        });
      }
    });
    this.store.dispatch(new fromGridActionsBarActions.InitSavedViewsCustomDisplayOptions(customFilters));
  }

  private addFilterValuesToGroupListItems(filters: PayMarketCustomDisplayFilters, sourceName: string, filterValues: string[]): void {
    filterValues.forEach(value => {
      const parsedValues = value.split(':');
      if (parsedValues.length) {
        filters[sourceName].push({
          Value: value,
          Name: parsedValues[parsedValues.length - 1]
        });
      }
    });
  }
}
