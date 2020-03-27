import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { StatementListViewModel } from '../../../shared/models';
import * as fromTotalRewardsReducer from '../reducers';
import * as fromTotalRewardsStatementsActions from '../actions/statement-list.page.actions';

@Component({
  selector: 'pf-total-rewards-statement-list-page',
  templateUrl: './statement-list.page.html',
  styleUrls: ['./statement-list.page.scss']
})
export class StatementListPageComponent implements OnInit {

  statements$: Observable<StatementListViewModel[]>;
  searchTerm$: Observable<string>;
  loadingStatements$: Observable<boolean>;

  constructor(private store: Store<fromTotalRewardsReducer.State>) { }

  ngOnInit() {
    this.statements$ = this.store.pipe(select(fromTotalRewardsReducer.getStatements));
    this.searchTerm$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementListSearchTerm));
    this.loadingStatements$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoading));

    this.store.dispatch(new fromTotalRewardsStatementsActions.LoadStatements());
  }

  onSearchTermChange(searchTerm: string): void {
    this.store.dispatch(new fromTotalRewardsStatementsActions.UpdateSearchTerm(searchTerm));
    this.store.dispatch(new fromTotalRewardsStatementsActions.LoadStatements());
  }
}
