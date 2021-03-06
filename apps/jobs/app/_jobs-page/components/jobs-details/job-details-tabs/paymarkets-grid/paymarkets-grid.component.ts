import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { EMPTY, Observable, of, Subscription, timer } from 'rxjs';
import { debounce, switchMap } from 'rxjs/operators';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { SortDescriptor } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { ViewField } from 'libs/models/payfactors-api';
import * as fromPfGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import * as fromPricingDetailsActions from 'libs/features/pricings/pricing-details/actions';
import { ApiServiceType } from 'libs/features/notes/notes-manager/constants/api-service-type-constants';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { PermissionService } from 'libs/core/services';
import { GroupedListItem } from 'libs/models/list';

import * as fromModifyPricingsReducer from '../../../../reducers';
import { PageViewIds } from '../../../../constants';
import { JobTitleCodePipe } from '../../../../pipes';

@Component({
  selector: 'pf-paymarkets-grid',
  templateUrl: './paymarkets-grid.component.html',
  styleUrls: ['./paymarkets-grid.component.scss']
})
export class PaymarketsGridComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() filters: PfDataGridFilter[];

  @ViewChild('globalActions') globalActions: ElementRef;
  @ViewChild('priciedFilter') pricedFilter: ElementRef;
  @ViewChild('payMarketFilter') payMarketFilter: ElementRef;
  @ViewChild('adjPctColumn') adjPctColumn: ElementRef;
  @ViewChild('payMarketColumn') payMarketColumn: ElementRef;
  @ViewChild('agingColumn') agingColumn: ElementRef;
  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild('matchInfoColumn') matchInfoColumn: ElementRef;
  @ViewChild('genericMrpColumn') genericMrpColumn: ElementRef;

  canModifyPricings: boolean;

  pageViewId = PageViewIds.PayMarkets;
  apiServiceType = ApiServiceType;

  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;

  pfThemeType = PfThemeType;

  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket', 'Status', 'Priced'];
  mrpFields = ['AllowMRP', 'BaseMRP', 'BonusMRP', 'BonusPctMRP', 'BonusTargetMRP', 'BonusTargetPctMRP', 'FixedMRP', 'LTIPMRP', 'LTIPPctMRP', 'RemunMRP',
    'SalesIncentiveActualMRP', 'SalesIncentiveActualPctMRP', 'SalesIncentiveTargetMRP', 'SalesIncentiveTargetPctMRP',
    'TargetLTIPMRP', 'TargetTDCMRP', 'TCCMRP', 'TCCPlusAllowMRP', 'TCCPlusAllowNoCarMRP', 'TCCTargetMRP', 'TCCTargetPlusAllowMRP',
    'TCCTargetPlusAllowNoCarMRP', 'TDCMRP', 'TGPMRP'];
  payMarketOptions: GroupedListItem[];

  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'CompanyJobs_Pricings_Recency'
  }, {
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];

  allPayMarkets = { display: '', value: null };
  pricedPayMarkets = { display: 'Yes', value: 'notnull' };
  unpricedPayMarkets = { display: 'No', value: 'isnull' };

  bitFilterOptions = [this.allPayMarkets, this.pricedPayMarkets, this.unpricedPayMarkets];

  companyPayMarketsSubscription: Subscription;

  columnTemplates = {};
  gridFieldSubscription: Subscription;

  payMarketField: ViewField;
  selectedPayMarkets: string[];

  pricedField: ViewField;
  pricedFilterValue: any;

  getPricingReviewedSuccessSubscription: Subscription;

  recalculatingPricingInfo$: Observable<boolean>;

  selectedJobRow: any;
  selectedJobRowSubscription: Subscription;

  jobTitleCodePipe: JobTitleCodePipe;

  notesApiServiceType: ApiServiceType;
  pricingIdForNotes: number;
  payMarketForNotes: string;

  constructor(private store: Store<fromModifyPricingsReducer.State>,
    private actionsSubject: ActionsSubject,
    private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.canModifyPricings = this.permissionService.CheckPermission([Permissions.MODIFY_PRICINGS], PermissionCheckEnum.Single);
    this.jobTitleCodePipe = new JobTitleCodePipe();
    this.recalculatingPricingInfo$ = this.store
      .select(fromModifyPricingsReducer.getRecalculatingPricingInfo)
      .pipe(switchMap(ev => of(ev)))
      .pipe(debounce(ev => ev ? timer(2000) : EMPTY));

    this.selectedJobRowSubscription = this.store.select(fromPfGridReducer.getSelectedRow, PageViewIds.Jobs).subscribe(row => {
      this.selectedJobRow = row;
    });

    this.companyPayMarketsSubscription = this.store.select(fromModifyPricingsReducer.getCompanyPayMarkets)
      .subscribe(o => {
        if (!!o) {
          this.payMarketOptions = cloneDeep(o);
        }
      });

    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.pricedField = fields.find(f => f.SourceName === 'CompanyJobPricing_ID');
        this.pricedFilterValue = this.bitFilterOptions.find(f => f.value === this.pricedField?.FilterOperator);

        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.selectedPayMarkets = this.payMarketField.FilterValues === null ? [] : cloneDeep(this.payMarketField.FilterValues);
      }
    });

    this.getPricingReviewedSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromPricingDetailsActions.SAVING_PRICING_SUCCESS))
      .subscribe(data => {
        this.store.dispatch(new fromPfDataGridActions.LoadData(PageViewIds.PayMarkets));
      });

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ActionBarClassName: 'ml-0 mr-3 mt-1'
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: true,
      ScrollToTop: true,
      SelectAllPanelItemName: 'pricings'
    };
  }

  ngAfterViewInit() {
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalFiltersTemplates: {
        'PayMarket': this.payMarketFilter,
        'CompanyJobPricing_ID': this.pricedFilter
      },
      GlobalActionsTemplate: this.globalActions
    };

    this.columnTemplates = {
      'PayMarket': { Template: this.payMarketColumn },
      'Aging_Factor': { Template: this.agingColumn },
      'Composite_Adjustment': { Template: this.adjPctColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn },
      [PfDataGridColType.pricingInfo]: { Template: this.matchInfoColumn }
    };

    this.mrpFields.forEach(mrp => {
      this.columnTemplates[mrp] = { Template: this.genericMrpColumn };
    });
  }

  ngOnDestroy() {
    this.companyPayMarketsSubscription.unsubscribe();
    this.gridFieldSubscription.unsubscribe();
    this.getPricingReviewedSuccessSubscription.unsubscribe();
    this.selectedJobRowSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filters?.currentValue) {
      this.filters = cloneDeep(changes.filters.currentValue)
        .filter(f => this.inboundFiltersToApply.indexOf(f.SourceName) > -1);
      const pricedInboundFilter = this.filters.find(f => f.SourceName === 'Priced');
      if (pricedInboundFilter) {
        pricedInboundFilter.SourceName = 'CompanyJobPricing_ID';
        pricedInboundFilter.Operator = pricedInboundFilter.Values[0] === 'true' ? 'notnull' : 'isnull';
        pricedInboundFilter.Values = null;
      }
    }
  }

  customSortOptions = (previousSortDescriptor: SortDescriptor[], currentSortDescriptor: SortDescriptor[]): SortDescriptor[] => {
    if (previousSortDescriptor.length > 1 && currentSortDescriptor && currentSortDescriptor[0].field === 'CompanyPayMarkets_PayMarket') {
      return [{
        dir: 'asc',
        field: currentSortDescriptor[0].field
      }];
    } else {
      return currentSortDescriptor;
    }

  }

  handlePayMarketValueChanged(payMarkets: GroupedListItem[]) {
    const field: ViewField = cloneDeep(this.payMarketField);
    field.FilterValues = payMarkets?.length > 0 ? payMarkets.map(x => x.Value) : null;
    field.FilterOperator = 'in';
    this.updateField(field);
  }

  handlePricedFilterChanged(value: any) {
    const field = cloneDeep(this.pricedField);
    field.FilterOperator = this.pricedFilterValue.value;
    field.FilterValues = null;

    this.updateField(field);
  }

  updateField(field: ViewField) {
    if (!!field.FilterValues || !!field.FilterOperator) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  reloadPaymarkets() {
    if (this.pricingIdForNotes) {
      this.store.dispatch(new fromPfGridActions.LoadData(`${PageViewIds.PayMarkets}`));
    }
    this.closeNotesManager();
  }

  openNotesManager(event: any, dataRow: any) {
    this.notesApiServiceType = ApiServiceType.Pricing;
    this.pricingIdForNotes = dataRow.CompanyJobs_Pricings_CompanyJobPricing_ID;
    this.payMarketForNotes = dataRow.CompanyPayMarkets_PayMarket;
    event.stopPropagation();
  }

  closeNotesManager() {
    this.pricingIdForNotes = null;
    this.notesApiServiceType = null;
  }
}
