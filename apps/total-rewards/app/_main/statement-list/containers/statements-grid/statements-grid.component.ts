import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromTotalRewardsReducer from './../../reducers';
import * as fromTotalRewardsStatementGridActions from '../../actions/statement-grid.actions';
import * as fromStatementGridActions from '../../actions/statement-grid.actions';
import { StatementListViewModel } from '../../../../shared/models';

@Component({
  selector: 'pf-statements-grid',
  templateUrl: './statements-grid.component.html',
  styleUrls: ['./statements-grid.component.scss']
})
export class StatementsGridComponent implements OnInit {

  @Input() autoLoad = false;

  statementsGridData$: Observable<GridDataResult>;
  statementsGridState$: Observable<State>;
  statementsLoading$: Observable<boolean>;
  statementsLoadingError$: Observable<boolean>;

  openActionMenuStatement$: Observable<StatementListViewModel>;

  constructor(private store: Store<fromTotalRewardsReducer.State>, private router: Router) { }

  ngOnInit() {
    this.statementsGridState$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridState));
    this.statementsGridData$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridData));
    this.statementsLoading$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoading));
    this.statementsLoadingError$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoadingError));
    this.openActionMenuStatement$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsOpenActionMenuStatement));
    if (this.autoLoad) {
      this.store.dispatch(new fromTotalRewardsStatementGridActions.LoadStatements());
    }
  }

  onDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.TotalRewardsStatements, state));
    this.store.dispatch(new fromTotalRewardsStatementGridActions.LoadStatements());
  }

  onActionMenuOpen(statement: StatementListViewModel): void {
    this.store.dispatch(new fromTotalRewardsStatementGridActions.OpenActionMenu(statement));
  }

  onActionMenuClose(): void {
    this.store.dispatch(new fromTotalRewardsStatementGridActions.CloseActionMenu());
  }

  onActionMenuPreviewClick(statement: StatementListViewModel): void {
    console.log('onActionMenuEditClick', statement);
  }

  onActionMenuGenerateStatementClick(statement: StatementListViewModel): void {
    console.log('onActionMenuGenerateStatementClick', statement);
  }

  onActionMenuEditClick(statement: StatementListViewModel): void {
    this.navigateToStatementEdit(statement.Id);
  }

  onActionMenuCopyClick(statement: StatementListViewModel): void {
    console.log('onActionMenuCopyClick', statement);
  }

  onActionMenuDeleteClick(): void {
    this.store.dispatch(new fromStatementGridActions.ConfirmDeleteStatement());
  }

  navigateToStatementEdit(statementId: string): void {
    this.router.navigate(['/statement/edit/', statementId]).then();
  }
}
