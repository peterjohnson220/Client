import { Component, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import { DeletePricingRequest } from 'libs/models/payfactors-api/pricings/request';

import * as fromJobsPageActions from '../../actions';
import * as fromJobsPageReducer from '../../reducers';



@Component({
  selector: 'pf-pricing-history',
  templateUrl: './pricing-history.component.html',
  styleUrls: ['./pricing-history.component.scss']
})
export class PricingHistoryComponent implements AfterViewInit {
  @Input() filters: PfDataGridFilter[];

  @ViewChild('createUserColumn', { static: false }) createUserColumn: ElementRef;

  colTemplates = {};

  pageViewId = 'c4c03aff-4164-4a47-800f-97f0fee46623';

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];

  deletePricingRequest: DeletePricingRequest;
  pricingIdToBeDeleted$: Observable<number>;

  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.pricingIdToBeDeleted$ = store.select(fromJobsPageReducer.getPricingIdToBeDeleted);
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Create_User': this.createUserColumn
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
}
