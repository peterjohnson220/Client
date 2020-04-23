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

  openActionMenuStatementId$: Observable<string>;

  constructor(private store: Store<fromTotalRewardsReducer.State>, private router: Router) { }

  ngOnInit() {
    this.statementsGridState$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridState));
    this.statementsGridData$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridData));
    this.statementsLoading$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoading));
    this.statementsLoadingError$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoadingError));
    this.openActionMenuStatementId$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsOpenActionMenuStatementId));
    if (this.autoLoad) {
      this.store.dispatch(new fromTotalRewardsStatementGridActions.LoadStatements());
    }
  }

  onDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.TotalRewardsStatements, state));
    this.store.dispatch(new fromTotalRewardsStatementGridActions.LoadStatements());
  }

  onActionMenuOpen(statementId: string): void {
    this.store.dispatch(new fromTotalRewardsStatementGridActions.OpenActionMenu(statementId));
  }

  onActionMenuClose(): void {
    this.store.dispatch(new fromTotalRewardsStatementGridActions.CloseActionMenu());
  }

  onActionMenuPreviewClick(statementId: string): void {
    console.log('onActionMenuEditClick', statementId);
  }

  onActionMenuGenerateStatementClick(statementId: string): void {
    console.log('onActionMenuGenerateStatementClick', statementId);
  }

  onActionMenuEditClick(statementId: string): void {
    this.navigateToStatementEdit(statementId);
  }

  onActionMenuCopyClick(statementId: string): void {
    console.log('onActionMenuCopyClick', statementId);
  }

  onActionMenuDeleteClick(statementId: string): void {
    console.log('onActionMenuDeleteClick', statementId);
  }

  navigateToStatementEdit(statementId: string): void {
    this.router.navigate(['/statement/edit/', statementId]).then();
  }
}
