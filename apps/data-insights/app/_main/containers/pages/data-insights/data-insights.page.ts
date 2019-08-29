import { Component, OnInit, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import { Workbook } from '../../../models';
import * as fromDataInsightsPageActions from '../../../actions/data-insights-page.actions';
import * as fromDataInsightsMainReducer from '../../../reducers';
import { SearchWorkbookModalComponent } from '../../search-workbook-modal';

@Component({
  selector: 'pf-data-insights-page',
  templateUrl: './data-insights.page.html',
  styleUrls: ['./data-insights.page.scss']
})
export class DataInsightsPageComponent implements OnInit {
  @ViewChild(SearchWorkbookModalComponent, { static: true })
  public searchWorkbookModalComponent: SearchWorkbookModalComponent;
  standardReports$: Observable<AsyncStateObj<Workbook[]>>;
  showStandardReportsSection$: Observable<boolean>;

  showStandardReportsSectionSub: Subscription;

  showAllStandardReports: boolean;
  showStandardReportsSection: boolean;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.standardReports$ = this.store.pipe(select(fromDataInsightsMainReducer.getStandardWorkbooksAsync));
    this.showStandardReportsSection$ = this.store.pipe(select(fromDataInsightsMainReducer.getShowStandardReportsSection));
  }

  ngOnInit(): void {
    this.showStandardReportsSectionSub = this.showStandardReportsSection$.subscribe(result => this.showStandardReportsSection = result);
    this.store.dispatch(new fromDataInsightsPageActions.GetStandardReportsDisplaySetting());
    this.store.dispatch(new fromDataInsightsPageActions.GetStandardReports());
  }

  trackByFn(sr: Workbook) {
    return sr.WorkbookId;
  }

  handleSearchClicked() {
    this.searchWorkbookModalComponent.open();
  }

  toggleShowAllStandardReports() {
    this.showAllStandardReports = !this.showAllStandardReports;
  }

  toggleStandardReportsDisplay(): void {
    this.showStandardReportsSection = !this.showStandardReportsSection;
    this.store.dispatch(new fromDataInsightsPageActions.SaveStandardReportsDisplaySetting({
      settingValue: this.showStandardReportsSection
    }));
  }
}
