import {Component, OnInit} from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import { StandardReportDetails } from '../../../models';
import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromStandardReportsListPageActions from '../../../actions/standard-reports-list-page.actions';

@Component({
  selector: 'pf-standard-reports-list-page',
  templateUrl: './standard-reports-list.page.html',
  styleUrls: ['./standard-reports-list.page.scss']
})
export class StandardReportsListPageComponent implements OnInit {
  standardReportDetails$: Observable<AsyncStateObj<StandardReportDetails[]>>;
  searchTerm: string;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.standardReportDetails$ = this.store.pipe(select(fromDataInsightsMainReducer.getStandardReportDetailsAsync));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromStandardReportsListPageActions.GetStandardReportDetails());
  }

  updateSearchTerm(value: string) {
    this.searchTerm = value;
  }
}
