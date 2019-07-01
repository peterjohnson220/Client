import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import { StandardReport } from '../../models';
import * as fromDataInsightsPageActions from '../../actions/data-insights-page.actions';
import * as fromDataInsightsMainReducer from '../../reducers';

@Component({
  selector: 'pf-data-insights-page',
  templateUrl: './data-insights.page.html',
  styleUrls: ['./data-insights.page.scss']
})
export class DataInsightsPageComponent implements OnInit {
  standardReports$: Observable<AsyncStateObj<StandardReport[]>>;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.standardReports$ = this.store.pipe(select(fromDataInsightsMainReducer.getStandardReportsAsync));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromDataInsightsPageActions.GetStandardReports());
  }

  trackByFn(sr: StandardReport) {
    return sr.Id;
  }
}
