import { Component, Output, EventEmitter, ViewEncapsulation, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { Subscription, Observable, Subject } from 'rxjs';

import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromMultiMatchActions from 'libs/features/multi-match/actions';
import * as fromNotificationActions from 'libs/features/app-notifications/actions';
import * as fromRootReducer from 'libs/state/state';

import * as fromJobsPageActions from '../../actions';

import { PageViewIds } from '../../constants';

@Component({
  selector: 'pf-jobs-details',
  templateUrl: './jobs-details.component.html',
  styleUrls: ['./jobs-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobsDetailsComponent implements OnDestroy, OnInit, OnChanges {

  @Input() jobDetailsFilters: PfDataGridFilter[];

  @Output() onClose = new EventEmitter();
  @Output() tabChanged = new EventEmitter();

  viewLoadedPayMarketSubscription: Subscription;
  viewLoadedEmployeesSubscription: Subscription;
  viewLoadedStructuresSubscription: Subscription;
  viewLoadedProjectsSubscription: Subscription;
  viewLoadedHistorySubscription: Subscription;
  recalculatePricingSubscription: Subscription;
  recalculateRelatedPricingsSubscription: Subscription;
  userContextSubscription: Subscription;

  selectedRow$: Observable<any>;

  tabStatusLoaded = {};
  tabStatusOpened = {};
  activeTab: string;

  userId: number;
  pageViewIds = PageViewIds;

  jobId: number;

  pricingHistoryChartFeatureFlag: RealTimeFlag = { key: FeatureFlags.PricingHistoryChart, value: false };
  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<fromPfGridReducer.State>,
    private actionsSubject: ActionsSubject,
    private featureFlagService: AbstractFeatureFlagService
  ) { }

  ngOnInit() {

    this.featureFlagService.bindEnabled(this.pricingHistoryChartFeatureFlag, this.unsubscribe$);

    this.selectedRow$ = this.store.select(fromPfGridReducer.getSelectedRow, PageViewIds.Jobs);

    this.viewLoadedPayMarketSubscription = this.store.select(fromPfGridReducer.getLoading, PageViewIds.PayMarkets).subscribe((o) => {
      this.tabStatusLoaded[PageViewIds.PayMarkets] = !o;
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
    this.userContextSubscription = this.store.select(fromRootReducer.getUserContext).subscribe(userContext => {
      this.userId = userContext?.UserId;
    });

    this.recalculatePricingSubscription = this.actionsSubject.pipe(ofType(fromNotificationActions.ADD_NOTIFICATION))
      .subscribe((action: fromNotificationActions.AddNotification) => {
        if (action.payload.From === 'Recalculate Related Pricing' && action.payload.Payload.Message === 'Success') {
          this.recalculatedRelatedPricingsHandler(action.payload.Payload.RelatedPricingIds);
        }
      });

    this.recalculateRelatedPricingsSubscription = this.actionsSubject.pipe(
      ofType(fromJobsPageActions.UPDATING_PRICING_MATCH_SUCCESS, // re scope survey data, weight/adj text boxes
        fromJobsPageActions.DELETING_PRICING_MATCH_SUCCESS,
        fromJobsPageActions.UPDATING_PRICING_SUCCESS, // composite adjustment text box on parent pricing
        fromMultiMatchActions.MODIFY_PRICINGS_SUCCESS) // multi match tool edits
    ).subscribe(data => {
      this.tabStatusLoaded[PageViewIds.PricingHistory] = false;
    });


    this.activeTab = PageViewIds.PayMarkets;
    this.tabStatusOpened[this.activeTab] = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['jobDetailsFilters']) {
      this.jobId = parseInt(this.jobDetailsFilters.find(v => v.SourceName === 'CompanyJob_ID').Value, 10);
    }
  }

  ngOnDestroy() {
    this.viewLoadedPayMarketSubscription.unsubscribe();
    this.viewLoadedEmployeesSubscription.unsubscribe();
    this.viewLoadedStructuresSubscription.unsubscribe();
    this.viewLoadedProjectsSubscription.unsubscribe();
    this.viewLoadedHistorySubscription.unsubscribe();
    this.recalculatePricingSubscription.unsubscribe();
    this.recalculateRelatedPricingsSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
    this.unsubscribe$.next();
  }

  recalculatedRelatedPricingsHandler(pricingIds: number[]) {
    if (this.activeTab === PageViewIds.PayMarkets) {
      this.store.dispatch(new fromJobsPageActions.RefreshLinkedPricings(pricingIds));
    } else {
      this.tabStatusLoaded[PageViewIds.PayMarkets] = false;
    }
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
}
