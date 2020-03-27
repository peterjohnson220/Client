import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromTotalRewardsReducer from './../../reducers';
import * as fromTotalRewardsStatementsActions from '../../actions/statement-list.page.actions';

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

  openActionMenuStatementId$: Observable<string>;

  constructor(private store: Store<fromTotalRewardsReducer.State>, private router: Router) { }

  ngOnInit() {
    this.statementsGridState$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridState));
    this.statementsGridData$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridData));
    this.statementsLoading$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoading));
    this.statementsLoadingError$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoadingError));
    this.openActionMenuStatementId$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsOpenActionMenuStatementId));
  }

  onDataStateChange(state: DataStateChangeEvent) {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.TotalRewardsStatements, state));
    this.store.dispatch(new fromTotalRewardsStatementsActions.LoadStatements());
  }

  onActionMenuOpen(statementId: string) {
    this.store.dispatch(new fromTotalRewardsStatementsActions.OpenActionMenu(statementId));
  }

  onActionMenuClose() {
    this.store.dispatch(new fromTotalRewardsStatementsActions.CloseActionMenu());
  }

  onActionMenuRunStatementClick(statement: any) {
    console.log('onActionMenuRunStatementClick', statement);
  }

  onActionMenuEditClick(statement: any) {
    console.log('onActionMenuEditClick', statement);
    this.navigateToStatementEdit(statement.Id);
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

  navigateToStatementEdit(id: any): void {
    this.router.navigate(['/statement/edit/', id]).then();
  }
}
