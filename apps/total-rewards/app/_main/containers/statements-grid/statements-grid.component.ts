import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromTotalRewardsReducer from './../../reducers';
import * as fromTotalRewardsActions from './../../actions';

@Component({
  selector: 'pf-statements-grid',
  templateUrl: './statements-grid.component.html',
  styleUrls: ['./statements-grid.component.scss']
})
export class StatementsGridComponent implements OnInit {

  statementsGridData$: Observable<GridDataResult>;
  statementsGridState$: Observable<State>;
  statementsLoading$: Observable<boolean>;
  statementsLoadingError$: Observable<boolean>;

  openActionMenuStatementId$: Observable<number>;

  constructor(private store: Store<fromTotalRewardsReducer.State>) { }

  ngOnInit() {
    this.statementsGridState$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridState));
    this.statementsGridData$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridData));
    this.statementsLoading$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoading));
    this.statementsLoadingError$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoadingError));
    this.openActionMenuStatementId$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsOpenActionMenuStatementId));
  }

  onDataStateChange(state: DataStateChangeEvent) {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.TotalRewardsStatements, state));
    this.store.dispatch(new fromTotalRewardsActions.LoadStatements());
  }

  onActionMenuOpen(statementId: number) {
    this.store.dispatch(new fromTotalRewardsActions.OpenActionMenu(statementId));
  }

  onActionMenuClose() {
    this.store.dispatch(new fromTotalRewardsActions.CloseActionMenu());
  }

  onActionMenuRunStatementClick(statement: any) {
    console.log('onActionMenuRunStatementClick', statement);
  }

  onActionMenuEditClick(statement: any) {
    console.log('onActionMenuEditClick', statement);
  }

  onActionMenuCopyClick(statement: any) {
    console.log('onActionMenuCopyClick', statement);
  }

  onActionMenuViewHistoryClick(statement: any) {
    console.log('onActionMenuViewHistoryClick', statement);
  }

  onActionMenuDeleteClick(statement: any) {
    console.log('onActionMenuDeleteClick', statement);
  }
}
