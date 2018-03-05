import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromPeerDataReducers from '../../../reducers';
import * as fromAddDataCutActions from '../../../actions/add-data-cut.actions';

@Component({
  selector: 'pf-add-data-cut-page',
  templateUrl: './add-data-cut.page.html',
  styleUrls: ['./add-data-cut.page.scss']
})
export class AddDataCutPageComponent implements OnInit {
  companyJobId: number;
  companyPayMarketId: number;
  userSessionId: number;
  addingDataCut$: Observable<boolean>;
  addingDataCutError$: Observable<boolean>;

  constructor(private store: Store<fromPeerDataReducers.State>, private route: ActivatedRoute) {
    this.addingDataCut$ = this.store.select(fromPeerDataReducers.getAddDataCutAddingDataCut);
    this.addingDataCutError$ = this.store.select(fromPeerDataReducers.getAddDataCutAddingDataCutError);
  }

  add() {
    this.store.dispatch(new fromAddDataCutActions.AddingDataCut({
      CompanyJobId: this.companyJobId,
      CompanyPayMarketId: this.companyPayMarketId,
      UserSessionId: this.userSessionId
    }));
  }

  cancel() {
    this.store.dispatch(new fromAddDataCutActions.CancelAddDataCut());
  }

  // Lifecycle events
  ngOnInit(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.companyJobId = +queryParamMap.get('companyJobId') || 0;
    this.companyPayMarketId = +queryParamMap.get('companyPayMarketId') || 0;
    this.userSessionId = +queryParamMap.get('userSessionId') || 0;
  }
}
