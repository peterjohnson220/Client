import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Statement } from './../../models';
import * as fromTotalRewardsReducer from './../../reducers';
import * as fromTotalRewardsActions from './../../actions';

@Component({
  selector: 'pf-total-rewards-page',
  templateUrl: './total-rewards.page.html',
  styleUrls: ['./total-rewards.page.scss']
})
export class TotalRewardsPageComponent implements OnInit {

  statements$: Observable<Statement[]>;
  searchTerm$: Observable<string>;
  loadingStatements$: Observable<boolean>;

  constructor(private store: Store<fromTotalRewardsReducer.State>) { }

  ngOnInit() {
    this.statements$ = this.store.pipe(select(fromTotalRewardsReducer.getStatements));
    this.searchTerm$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsSearchTerm));
    this.loadingStatements$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoading));

    this.store.dispatch(new fromTotalRewardsActions.LoadStatements());
  }

  onSearchTermChange(searchTerm: string): void {
    this.store.dispatch(new fromTotalRewardsActions.UpdateSearchTerm(searchTerm));
    this.store.dispatch(new fromTotalRewardsActions.LoadStatements());
  }

  onNewStatementClick(): void {
    this.store.dispatch(new fromTotalRewardsActions.OpenCreateNewStatementModal());
  }
}
