import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromComphubPageActions from '../../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../../reducers';
import { ExchangeDataSet, WorkflowContext } from '../../../../models';

@Component({
  selector: 'pf-trends-landing-card',
  templateUrl: './trends-landing.card.component.html',
  styleUrls: ['./trends-landing.card.component.scss']
})
export class TrendsLandingCardComponent {

  workflowContext$: Observable<WorkflowContext>;
  exchangeDataSets$: Observable<ExchangeDataSet[]>;

constructor(private store: Store<fromComphubMainReducer.State>) {
  this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
  this.exchangeDataSets$ = this.store.select(fromComphubMainReducer.getExchangeDataSets);
}

  handleExchangeDataSetChanged(exchangeId: number) {
    this.store.dispatch(new fromComphubPageActions.UpdateActiveExchangeDataSet(exchangeId));
  }
}
