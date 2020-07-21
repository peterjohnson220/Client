import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { ActionBarConfig,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridRowActionsConfig
} from 'libs/features/pf-data-grid/models';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';
import { Permissions } from 'libs/constants';
import * as fromPayMarketManagementReducers from 'libs/features/paymarket-management/reducers';
import * as fromPayMarketModalActions from 'libs/features/paymarket-management/actions/paymarket-modal.actions';
import { PfSecuredResourceDirective } from 'libs/forms/directives';

import * as fromPayMarketsPageActions from '../actions/paymarkets-page.actions';
import * as fromPayMarketsPageReducer from '../reducers';
import { PayMarketsPageViewId } from '../models';

@Component({
  selector: 'pf-paymarkets-page',
  templateUrl: './paymarkets.page.html',
  styleUrls: ['./paymarkets.page.scss']
})
export class PayMarketsPageComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('defaultScopesColumn') defaultScopesColumn: ElementRef;
  @ViewChild('payMarketNameColumn') payMarketNameColumn: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) public gridGlobalActionsTemplate: ElementRef;
  @ViewChild(PfSecuredResourceDirective) pfSecuredResourceDirective: PfSecuredResourceDirective;

  identity$: Observable<UserContext>;
  identitySubscription: Subscription;

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

  constructor(
    private store: Store<fromPayMarketsPageReducer.State>,
    private userContextStore: Store<fromRootState.State>,
    public payMarketManagementStore: Store<fromPayMarketManagementReducers.State>,
  ) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      AllowSaveFilter: false
    };
  }

  ngOnInit() {
    this.identitySubscription = this.identity$.subscribe(i => {
      if (!!i) {
        this.defaultPayMarketId = i.DefaultPayMarketId;
        this.companyId =  i.CompanyId;
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
      'Default_Scope': { Template: this.defaultScopesColumn},
      'PayMarket': { Template: this.payMarketNameColumn}
    };
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
  }

  ngOnDestroy() {
    this.identitySubscription.unsubscribe();
  }

  customSortOptions = (sortDescriptor: SortDescriptor[]): SortDescriptor[] => {
    if (sortDescriptor && sortDescriptor.length > 0) {
      const sizeSortInfo = sortDescriptor.find(s => s.field === 'CompanyPayMarkets_ScopeSize');
      if (sizeSortInfo) {
        sortDescriptor = this.getSizeColumnSort(sizeSortInfo);
      }
      if (!sortDescriptor.some(s => s.field === 'CompanyPayMarkets_IsDefaultPayMarket')) {
        sortDescriptor.unshift({
          dir: 'desc',
          field: 'CompanyPayMarkets_IsDefaultPayMarket'
        });
      }
    }
    return sortDescriptor;
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
