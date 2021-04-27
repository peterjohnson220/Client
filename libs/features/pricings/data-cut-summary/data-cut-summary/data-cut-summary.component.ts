import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { DataCutSummaryEntityTypes } from 'libs/constants';

import { DataCutSummaryTypes } from '../constants';
import * as fromDataCutSummaryActions from '../actions';
import * as fromDataCutSummaryReducer from '../reducers';

@Component({
  selector: 'pf-data-cut-summary',
  templateUrl: './data-cut-summary.component.html',
  styleUrls: ['./data-cut-summary.component.scss']
})
export class DataCutSummaryComponent implements OnChanges {
  @Input() pricingId: number;

  @Input() entityType: DataCutSummaryEntityTypes;
  @Input() entityId: any;
  @Input() matchType: string;

  dataCutSummaryTypes = DataCutSummaryTypes;
  loading$: Observable<boolean>;
  showError$: Observable<boolean>;
  dataCutSummary$: any;

  constructor(private store: Store<fromDataCutSummaryReducer.State>) {
    this.loading$ = this.store.select(fromDataCutSummaryReducer.getLoading);
    this.showError$ = this.store.select(fromDataCutSummaryReducer.getHasError);
    this.dataCutSummary$ = this.store.select(fromDataCutSummaryReducer.getDataCutSummary);
    this.dataCutSummaryTypes = DataCutSummaryTypes;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.store.dispatch(new fromDataCutSummaryActions.ClearDataCutSummary());

    if ((changes['entityId'] && changes['entityId'].currentValue) &&
      (changes['entityType'] && changes['entityType'].currentValue) &&
      (changes['matchType'] && changes['matchType'].currentValue)
    ) {
      this.store.dispatch(new fromDataCutSummaryActions.LoadDataCutSummary(
        {
          entityId: changes['entityId'].currentValue,
          entityType: changes['entityType'].currentValue,
          matchType: changes['matchType'].currentValue
        }));
    }
  }
}
