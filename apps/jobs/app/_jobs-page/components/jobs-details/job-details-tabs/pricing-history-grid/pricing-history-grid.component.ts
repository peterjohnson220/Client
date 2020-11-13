import { Component, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges, OnInit } from '@angular/core';

import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/pf-data-grid/models';
import { DeletePricingRequest } from 'libs/models/payfactors-api/pricings/request';
import { Permissions } from 'libs/constants';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPricingDetailsActions from 'libs/features/pricing-details/actions';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import { PfThemeType } from 'libs/features/pf-data-grid/enums/pf-theme-type.enum';
import { AsyncStateObj } from 'libs/models';

import * as fromModifyPricingsActions from '../../../../actions';
import * as fromModifyPricingsReducer from '../../../../reducers';
import { PageViewIds } from '../../../../constants';



@Component({
  selector: 'pf-pricing-history-grid',
  templateUrl: './pricing-history-grid.component.html',
  styleUrls: ['./pricing-history-grid.component.scss']
})
export class PricingHistoryGridComponent implements AfterViewInit, OnInit, OnDestroy, OnChanges {
  @Input() filters: PfDataGridFilter[];

  @ViewChild('pricingActionsColumn') pricingActionsColumn: ElementRef;
  @ViewChild('payMarketFilter') payMarketFilter: ElementRef;
  @ViewChild('auditUserColumn') auditUserColumn: ElementRef;

  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket', 'Status'];
  pageViewId = PageViewIds.PricingHistory;

  colTemplates = {};

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }, {
    dir: 'desc',
    field: 'CompanyJobs_Pricings_Effective_Date'
  }];

  permissions = Permissions;
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  getPricingReviewedSuccessSubscription: Subscription;
  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  selectedPayMarket: any;
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  pricingId: number;

  showPricingDetails = new BehaviorSubject<boolean>(false);
  showPricingDetails$ = this.showPricingDetails.asObservable();
  showDeletePricing = new BehaviorSubject<boolean>(false);
  showDeletePricing$ = this.showDeletePricing.asObservable();

  deletingPricing$: Observable<AsyncStateObj<boolean>>;

  deletePricingRequest: DeletePricingRequest;

  getPricingDetailsSuccessSubscription: Subscription;
  getDeletingPricingSuccessSubscription: Subscription;
  hasInfiniteScrollFeatureFlagEnabled: boolean;
  noRecordsMessage: string;

  pfThemeType = PfThemeType;

  constructor(
    private store: Store<fromModifyPricingsReducer.State>,
    private actionsSubject: ActionsSubject,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.hasInfiniteScrollFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.PfDataGridInfiniteScroll, false);
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: this.hasInfiniteScrollFeatureFlagEnabled,
      ScrollToTop: this.hasInfiniteScrollFeatureFlagEnabled
    };
  }

  ngOnInit(): void {
    this.companyPayMarketsSubscription = this.store.select(fromModifyPricingsReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });
    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          { Value: this.payMarketField.FilterValue, Id: this.payMarketField.FilterValue } : null;
      }
    });

    // We show the NotesModal only after the Notes have loaded. This way we ensure the modal height doesn't jump around but is dynamic
    this.getPricingDetailsSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromPricingDetailsActions.GET_PRICING_INFO_SUCCESS) || ofType(fromPricingDetailsActions.GET_PRICING_INFO_ERROR))
      .subscribe(data => {
        this.showPricingDetails.next(true);
      });

    this.getPricingReviewedSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromPricingDetailsActions.SAVING_PRICING_SUCCESS))
      .subscribe(data => {
        this.store.dispatch(new fromPfDataGridActions.LoadData(PageViewIds.PricingHistory));
      });

    this.deletingPricing$ = this.store.select(fromModifyPricingsReducer.getDeletingPricing);
    this.getDeletingPricingSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromModifyPricingsActions.DELETING_PRICING_SUCCESS))
      .subscribe(data => {
        this.showDeletePricing.next(false);
      });


    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ActionBarClassName: 'ml-0 mr-3 mt-1'
    };
  }

  ngAfterViewInit() {
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalFiltersTemplates: {
        'PayMarket': this.payMarketFilter
      }
    };
    this.colTemplates = {
      'CompanyJobPricing_ID': { Template: this.pricingActionsColumn },
      'Create_User': { Template: this.auditUserColumn },
      'Edit_User': { Template: this.auditUserColumn }
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.filters = cloneDeep(changes['filters'].currentValue)
        .filter(f => this.inboundFiltersToApply.indexOf(f.SourceName) > -1);

      if (this.filters.find(x => x.SourceName === 'Status')) {
        this.noRecordsMessage = 'There is no pricing history for the filter criteria you have selected.';
      } else {
        this.noRecordsMessage = 'This job has not been priced and does not have any pricing history.';
      }
    }
  }

  showDeletePricingModal(event: any) {
    this.deletePricingRequest = {
      CompanyJobPricingId: event['CompanyJobs_Pricings_CompanyJobPricing_ID'],
      CompanyId: event['CompanyJobs_Pricings_Company_ID'],
      CompanyJobId: event['CompanyJobs_Pricings_CompanyJob_ID'],
      CompanyPayMarketId: event['CompanyJobs_Pricings_CompanyPayMarket_ID']
    };
    this.store.dispatch(new fromModifyPricingsActions.ResetModifyPricingsModals());
    this.showDeletePricing.next(true);
  }

  deletePricing() {
    this.store.dispatch(new fromModifyPricingsActions.DeletingPricing(this.deletePricingRequest));
  }

  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
    this.getPricingDetailsSuccessSubscription.unsubscribe();
    this.getDeletingPricingSuccessSubscription.unsubscribe();
  }

  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.payMarketField);
    field.FilterValue = value.Id;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  updateField(field) {
    if (field.FilterValue) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pageViewId, field));
    }
  }
  handleFilter(value) {
    this.filteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
}
