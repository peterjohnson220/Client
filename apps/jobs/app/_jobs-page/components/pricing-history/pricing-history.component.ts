import { Component, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { DeletePricingRequest } from 'libs/models/payfactors-api/pricings/request';
import { Permissions } from 'libs/constants';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as cloneDeep from 'lodash.clonedeep';
import * as fromJobsPageActions from '../../actions';
import * as fromJobsPageReducer from '../../reducers';
import { PageViewIds } from '../../constants';


@Component({
  selector: 'pf-pricing-history',
  templateUrl: './pricing-history.component.html'
})
export class PricingHistoryComponent implements AfterViewInit, OnDestroy {
  @Input() filters: PfDataGridFilter[];

  @ViewChild('createUserColumn', { static: false }) createUserColumn: ElementRef;
  @ViewChild('payMarketFilter', { static: false }) payMarketFilter: ElementRef;

  pageViewId = PageViewIds.PricingHistory;

  colTemplates = {};

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];

  deletePricingRequest: DeletePricingRequest;
  pricingIdToBeDeleted$: Observable<number>;
  _Permissions = null;
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  selectedPayMarket: any;
  actionBarConfig: ActionBarConfig;

  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.pricingIdToBeDeleted$ = store.select(fromJobsPageReducer.getPricingIdToBeDeleted);
    this._Permissions = Permissions;

    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
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
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ActionBarClassName: 'employee-grid-action-bar ml-0 mt-1'
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
      'Create_User': { Template: this.createUserColumn }
    };
  }

  confirmDeletePricingModal(event: any) {
    this.deletePricingRequest = {
      CompanyJobPricingId: event['CompanyJobs_Pricings_CompanyJobPricing_ID'],
      CompanyId: event['CompanyJobs_Pricings_Company_ID'],
      CompanyJobId: event['CompanyJobs_Pricings_CompanyJob_ID'],
      CompanyPayMarketId: event['CompanyJobs_Pricings_CompanyPayMarket_ID']
    };

    this.store.dispatch(new fromJobsPageActions.ConfirmDeletePricingFromGrid(this.deletePricingRequest));
  }

  cancelDeletePricing() {
    this.store.dispatch(new fromJobsPageActions.CancelDeletePricing());
    this.deletePricingRequest = undefined;
  }

  deletePricing() {
    this.store.dispatch(new fromJobsPageActions.DeletePricingFromGrid(this.pageViewId, this.deletePricingRequest));
  }
  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
  }
  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.payMarketField);
    field.FilterValue = value.Id;
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
