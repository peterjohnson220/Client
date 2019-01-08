import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromDashboardReducer from '../../reducers';
import * as fromCompositeSummaryDownloadActions from '../../actions/composite-summary-download.actions';

@Component({
  selector: 'pf-composite-summary-download',
  templateUrl: './composite-summary-download.component.html',
  styleUrls: ['./composite-summary-download.component.scss']
})
export class CompositeSummaryDownloadComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private store: Store<fromDashboardReducer.State>) {

  }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;

    if (params.compositeDataLoadExternalId && params.action) {
      this.store.dispatch(new fromCompositeSummaryDownloadActions.AuthRedirectAttempted(params));
    }
  }

}
