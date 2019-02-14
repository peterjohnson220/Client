import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromSummaryCardActions from '../../../actions/summary-card.actions';
import * as fromComphubMainReducer from '../../../reducers';

@Component({
  selector: 'pf-summary-card',
  templateUrl: './summary.card.component.html',
  styleUrls: ['./summary.card.component.scss']
})
export class SummaryCardComponent {

  constructor(private store: Store<fromComphubMainReducer.State>) { }

  handlePriceNewJobClicked() {
    this.store.dispatch(new fromSummaryCardActions.PriceNewJob());
  }
}
