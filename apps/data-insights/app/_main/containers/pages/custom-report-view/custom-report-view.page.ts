import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDataViewActions from '../../../actions/data-view.actions';
import { UserDataView } from '../../../models';

@Component({
  selector: 'pf-custom-report-view-page',
  templateUrl: './custom-report-view.page.html',
  styleUrls: ['./custom-report-view.page.scss']
})

export class CustomReportViewPageComponent implements OnInit {

  userDataView$: Observable<AsyncStateObj<UserDataView>>;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private route: ActivatedRoute
  ) {
    this.userDataView$ = this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromDataViewActions.GetUserDataView({ dataViewId: this.route.snapshot.params.dataViewId }));
  }
}
