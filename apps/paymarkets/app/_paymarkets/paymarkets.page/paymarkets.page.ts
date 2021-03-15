import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { ActionBarConfig,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridConfig,
  GridRowActionsConfig
} from 'libs/features/grids/pf-data-grid/models';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';
import { Permissions } from 'libs/constants';
import * as fromPayMarketManagementReducers from 'libs/features/paymarkets/paymarket-management/reducers';
import * as fromPayMarketModalActions from 'libs/features/paymarkets/paymarket-management/actions/paymarket-modal.actions';
import { PfSecuredResourceDirective } from 'libs/forms/directives';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import * as fromLayoutWrapperReducer from 'libs/ui/layout-wrapper/reducers';

import * as fromPayMarketsPageActions from '../actions/paymarkets-page.actions';
import * as fromPayMarketsPageReducer from '../reducers';
import { PayMarketsPageViewId } from '../models';

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
  @ViewChild(PfSecuredResourceDirective) pfSecuredResourceDirective: PfSecuredResourceDirective;

  identity$: Observable<UserContext>;
  isTileView$: Observable<string>;
  leftSidebarOpen$: Observable<boolean>;

  identitySubscription: Subscription;
  isTileViewSubscription: Subscription;
  leftSidebarOpenSubscription: Subscription;

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
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  pageViewId = PayMarketsPageViewId;
  companyId: number;
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

  constructor(
    private store: Store<fromPayMarketsPageReducer.State>,
    private userContextStore: Store<fromRootState.State>,
    public payMarketManagementStore: Store<fromPayMarketManagementReducers.State>,
    private layoutWrapperStore: Store<fromLayoutWrapperReducer.State>,
    private settingsService: SettingsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      AllowSaveFilter: false
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
  }

  ngOnInit() {
    this.identitySubscription = this.identity$.subscribe(i => {
      if (!!i) {
        this.defaultPayMarketId = i.DefaultPayMarketId;
        this.companyId =  i.CompanyId;
      }
    });
    this.isTileViewSubscription = this.isTileView$.subscribe(value => {
      this.isTileView = value === this.tileView;
      this.changeDetectorRef.detectChanges();
    });
    this.leftSidebarOpenSubscription = this.leftSidebarOpen$.subscribe(isOpen => {
      if (isOpen !== null) {
        this.isLeftSidebarOpened = isOpen;
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
  }

  ngOnDestroy() {
    this.identitySubscription.unsubscribe();
    this.isTileViewSubscription.unsubscribe();
    this.leftSidebarOpenSubscription.unsubscribe();
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
}
