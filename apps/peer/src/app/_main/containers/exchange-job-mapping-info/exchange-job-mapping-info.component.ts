import { Component, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ExchangeJobMapping } from 'libs/models/peer';

import * as fromPeerMainReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-job-mapping-info',
  templateUrl: './exchange-job-mapping-info.component.html',
  styleUrls: ['./exchange-job-mapping-info.component.scss']
})
export class ExchangeJobMappingInfoComponent {
  @Output() closeClicked = new EventEmitter();

  selectedExchangeJobMapping$: Observable<ExchangeJobMapping>;

  constructor(
    private store: Store<fromPeerMainReducer.State>
  ) {
    this.selectedExchangeJobMapping$ = this.store.select(fromPeerMainReducer.getSelectedExchangeJobMapping);
  }

  close() {
    this.closeClicked.emit();
  }
}
