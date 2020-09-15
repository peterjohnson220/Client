import { Component, Output, EventEmitter, ViewEncapsulation, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subscription, Observable } from 'rxjs';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

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
  viewLoadedPayMarketSubscription: Subscription;
  viewLoadedEmployeesSubscription: Subscription;
  viewLoadedStructuresSubscription: Subscription;
  viewLoadedProjectsSubscription: Subscription;
  viewLoadedHistorySubscription: Subscription;

  tabStatusLoaded = {};
  tabStatusOpened = {};
  activeTab: string;

  pageViewIds = PageViewIds;

  selectedRow$: Observable<any>;

  constructor(private store: Store<fromPfGridReducer.State>) {
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
    this.activeTab = PageViewIds.PayMarkets;
    this.tabStatusOpened[this.activeTab] = true;
  }

  ngOnDestroy() {
    this.viewLoadedPayMarketSubscription.unsubscribe();
    this.viewLoadedEmployeesSubscription.unsubscribe();
    this.viewLoadedStructuresSubscription.unsubscribe();
    this.viewLoadedProjectsSubscription.unsubscribe();
    this.viewLoadedHistorySubscription.unsubscribe();
  }
}
