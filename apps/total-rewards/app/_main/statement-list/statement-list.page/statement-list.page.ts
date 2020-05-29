import {Component, OnInit, ViewChild} from '@angular/core';

import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';

import * as fromStatementListReducers from '../reducers';
import * as fromStatementListPageActions from '../actions/statement-list.page.actions';
import * as fromStatementGridActions from '../actions/statement-grid.actions';

@Component({
  selector: 'pf-total-rewards-statement-list-page',
  templateUrl: './statement-list.page.html',
  styleUrls: ['./statement-list.page.scss']
})
export class StatementListPageComponent implements OnInit {

  focusedTab$: Observable<'Statements' | 'Templates'>;
  statementsLoading$: Observable<boolean>;
  statementsLoadingError$: Observable<boolean>;
  statementsSearchTerm$: Observable<string>;
  statementsTotal$: Observable<number>;

  @ViewChild('tabs')
  tabs: NgbTabset;

  constructor(private store: Store<fromStatementListReducers.State>) {
  }

  ngOnInit(): void {
    this.focusedTab$ = this.store.pipe(select(fromStatementListReducers.getFocusedTab));
    this.statementsLoading$ = this.store.pipe(select(fromStatementListReducers.getStatementsLoading));
    this.statementsLoadingError$ = this.store.pipe(select(fromStatementListReducers.getStatementsLoadingError));
    this.statementsTotal$ = this.store.pipe(select(fromStatementListReducers.getStatementsTotal));
    this.statementsSearchTerm$ = this.store.pipe(select(fromStatementListReducers.getStatementsSearchTerm));
    this.store.dispatch(new fromStatementListPageActions.SetTab('Statements'));
    this.store.dispatch(new fromStatementGridActions.LoadStatements());
  }

  onSearchTermChange(searchTerm: string): void {
    this.store.dispatch(new fromStatementGridActions.UpdateSearchTerm(searchTerm));
    this.store.dispatch(new fromStatementGridActions.LoadStatements());
  }

  onTabChange(): void  {
    this.store.dispatch(new fromStatementListPageActions.ToggleTab());
  }

  onCreateNewClicked(): void {
    this.tabs.select('Templates');
  }
}
