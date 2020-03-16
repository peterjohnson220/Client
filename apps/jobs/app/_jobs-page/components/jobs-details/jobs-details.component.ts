import { Component, Output, EventEmitter, ViewEncapsulation, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromJobsPageReducer from '../../reducers';
import * as fromJobsPageActions from '../../actions';
import { PageViewIds } from '../../constants';

@Component({
  selector: 'pf-jobs-details',
  templateUrl: './jobs-details.component.html',
  styleUrls: ['./jobs-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobsDetailsComponent implements OnDestroy, OnInit {

  @Input() jobDetailsFilters: PfDataGridFilter[];

  @Output() onClose = new EventEmitter();
  @Output() tabChanged = new EventEmitter();
  selectedRecordSubscription: Subscription;
  viewLoadedPricingDetailsSubscription: Subscription;
  viewLoadedEmployeesSubscription: Subscription;
  viewLoadedStructuresSubscription: Subscription;
  viewLoadedProjectsSubscription: Subscription;
  viewLoadedHistorySubscription: Subscription;
  viewLoadedNotPricedPayMarketsSubscription: Subscription;
  pricingDetailsViewSubscription: Subscription;
  notPricedDataSubscription: Subscription;
  pricedDataSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;

  tabStatusLoaded = {};
  tabStatusOpened = {};
  activeTab: string;
  pricingDetailsView: string;
  payMarketCount: number;

  pricedDataObj: any;
  pricedCount: number;
  notPricedDataObj: any;
  notPricedCount: number;

  pageViewIds = PageViewIds;

  constructor(private store: Store<fromPfGridReducer.State>) {
    this.selectedRecordSubscription = this.store.select(fromPfGridReducer.getSelectedRecordId, PageViewIds.Jobs).subscribe(() => {
      // When changing jobs, pricing details tab should be configured for priced pay markets. ONLY do this if NOT currently looking at pricing details tab
      this.tabStatusLoaded = {};
      this.tabStatusOpened = {};
      if (this.activeTab) {
        this.tabStatusOpened[this.activeTab] = true;
        if (this.activeTab !== PageViewIds.PricingDetailsTabContainer) {
          this.store.dispatch(new fromJobsPageActions.ChangePricingDetailsView('Priced'));
        }
      }
    });
    this.viewLoadedPricingDetailsSubscription = this.store.select(fromPfGridReducer.getLoading, PageViewIds.PricingDetails).subscribe((o) => {
      this.tabStatusLoaded[PageViewIds.PricingDetails] = !o;
      if (!this.tabStatusLoaded[PageViewIds.PricingDetailsTabContainer]) {
        this.tabStatusLoaded[PageViewIds.PricingDetailsTabContainer] = !o;
      }
    });
    this.viewLoadedEmployeesSubscription = this.store.select(fromPfGridReducer.getLoading, PageViewIds.Employees).subscribe((o) => {
      this.tabStatusLoaded[PageViewIds.Employees] = !o;
    });
    this.viewLoadedStructuresSubscription = this.store.select(fromPfGridReducer.getLoading, PageViewIds.Structures).subscribe((o) => {
      this.tabStatusLoaded[PageViewIds.Structures] = !o;
    });
    this.viewLoadedProjectsSubscription = this.store.select(fromPfGridReducer.getLoading, PageViewIds.Projects).subscribe((o) => {
      this.tabStatusLoaded[PageViewIds.Projects] = !o;
    });
    this.viewLoadedHistorySubscription = this.store.select(fromPfGridReducer.getLoading, PageViewIds.PricingHistory).subscribe((o) => {
      this.tabStatusLoaded[PageViewIds.PricingHistory] = !o;
    });
    this.viewLoadedNotPricedPayMarketsSubscription = this.store.select(fromPfGridReducer.getLoading, PageViewIds.NotPricedPayMarkets).subscribe((o) => {
      this.tabStatusLoaded[PageViewIds.NotPricedPayMarkets] = !o;
      if (!this.tabStatusLoaded[PageViewIds.PricingDetailsTabContainer]) {
        this.tabStatusLoaded[PageViewIds.PricingDetailsTabContainer] = !o;
      }
    });

    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.payMarketCount = o.length;
      });

    this.notPricedDataSubscription = this.store.select(fromPfGridReducer.getData, PageViewIds.NotPricedPayMarkets).subscribe(notPricedData => {
      if (notPricedData) {
        this.notPricedDataObj = notPricedData;
        if (notPricedData.total > 0) {
          this.pricedCount = notPricedData.data[0]['vw_UnpricedJobPayMarketMetadata_PricingCount'];
          this.notPricedCount = this.payMarketCount - this.pricedCount;
        } else if (this.pricedDataObj) {
          if (this.pricedDataObj.total > 0) {
            this.pricedCount = this.payMarketCount - this.pricedDataObj.data[0]['CompanyJobs_Pricings_NotPricedCount'];
          } else {
            this.pricedCount = this.payMarketCount - this.notPricedCount;
          }
        } else {
          this.pricedCount = this.payMarketCount;
        }
      }
    });

    this.pricedDataSubscription = this.store.select(fromPfGridReducer.getData, PageViewIds.PricingDetails).subscribe(pricedData => {
      if (pricedData) {
        this.pricedDataObj = pricedData;
        if (pricedData.total > 0) {
          this.notPricedCount = pricedData.data[0]['CompanyJobs_Pricings_NotPricedCount'];
          this.pricedCount = this.payMarketCount - this.notPricedCount;
        } else if (this.notPricedDataObj) {
          if (this.notPricedDataObj.total > 0) {
            this.notPricedCount = this.payMarketCount - this.notPricedDataObj.data[0]['vw_UnpricedJobPayMarketMetadata_PricingCount'];
          } else {
            this.notPricedCount = this.payMarketCount - this.pricedCount;
          }
        } else {
          this.notPricedCount = this.payMarketCount;
        }
      }
    });
    this.pricingDetailsViewSubscription = this.store.select(fromJobsPageReducer.getPricingDetailsView).subscribe(pdv => {
      this.pricingDetailsView = pdv;
    });
  }

  close() {
    this.onClose.emit(null);
  }

  tabChange(event: any) {
    if (PageViewIds[event.activeId]) {
      this.tabChanged.emit(PageViewIds[event.activeId]);
    }
    this.activeTab = event.nextId;

    if (!this.tabStatusOpened[this.activeTab]) {
      this.tabStatusOpened[this.activeTab] = true;
    } else if (!this.tabStatusLoaded[this.activeTab]) {
      this.tabStatusOpened[this.activeTab] = false;
      // Need to have timeout before putting it back to true so UI can react on change and reload the component
      setTimeout(() => this.tabStatusOpened[this.activeTab] = true, 0);
    }
  }
  ngOnInit() {
    this.activeTab = PageViewIds.PricingDetailsTabContainer;
    this.tabStatusOpened[this.activeTab] = true;

    const tabChangeObj = {
      nextId: PageViewIds.PricingDetailsTabContainer
    };
    this.tabChange(tabChangeObj);
  }
  ngOnDestroy() {
    this.selectedRecordSubscription.unsubscribe();
    this.viewLoadedEmployeesSubscription.unsubscribe();
    this.viewLoadedStructuresSubscription.unsubscribe();
    this.viewLoadedProjectsSubscription.unsubscribe();
    this.viewLoadedHistorySubscription.unsubscribe();
    this.viewLoadedPricingDetailsSubscription.unsubscribe();
    this.pricingDetailsViewSubscription.unsubscribe();
    this.viewLoadedNotPricedPayMarketsSubscription.unsubscribe();
    this.notPricedDataSubscription.unsubscribe();
    this.pricedDataSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();

    this.store.dispatch(new fromJobsPageActions.ChangePricingDetailsView('Priced'));
  }
}
