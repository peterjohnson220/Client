import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { SearchBase } from 'libs/features/search/containers/search-base';
import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models/security';
import {FilterType, TextFilter} from 'libs/features/search/models';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromStatementAssignmentsReducers from '../../reducers';
import * as fromStatementAssignmentModalActions from '../../actions/statement-assignment-modal.actions';
import * as fromEmployeeSearchResultsActions from '../../actions/employee-search-results.actions';
import { StatementAssignmentConfig } from '../../models';

@Component({
  selector: 'pf-statement-assignment-modal',
  templateUrl: './statement-assignment-modal.component.html',
  styleUrls: ['./statement-assignment-modal.component.scss']
})
export class StatementAssignmentModalComponent extends SearchBase implements OnInit, OnDestroy {
  isOpen$: Observable<boolean>;
  numberOfResults$: Observable<number>;
  userContext$: Observable<UserContext>;
  searchingFilter$: Observable<boolean>;
  assignedEmployeesCount$: Observable<number>;
  selectedEmployeesCount$: Observable<number>;
  searchResultsCount$: Observable<number>;
  assignEmployeesLoading$: Observable<boolean>;
  assignEmployeesError$: Observable<boolean>;
  assignAllEmployeesLoading$: Observable<boolean>;
  assignAllEmployeesError$: Observable<boolean>;
  statement$: Observable<Statement>;

  assignedEmployeesCountSubscription = new Subscription();
  selectedEmployeesCountSubscription = new Subscription();
  searchResultsCountSubscription = new Subscription();

  assignedEmployeesCount: number;
  selectedEmployeesCount: number;
  searchResultsCount: number;

  staticFilters: TextFilter[] = [
    {
      Id: 'trsOmniSearch',
      BackingField: 'total_rewards_omni_search',
      DisplayName: 'Job Title/Name/ID',
      Value: '',
      Type: FilterType.Text,
      Order: 1,
      CssClassName: 'total-rewards-omni-search'
    }
  ];
  statementAssignmentMax = StatementAssignmentConfig.statementAssignmentMax;

  constructor(store: Store<fromSearchReducer.State>) {
    super(store);
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.statement$ = this.store.pipe(select(fromStatementAssignmentsReducers.getStatement));
    this.selectedEmployeesCount$ = store.select(fromStatementAssignmentsReducers.getSelectedEmployeesCount);
    this.searchResultsCount$ = store.select(fromSearchReducer.getNumberOfResultsOnServer);
    this.assignEmployeesLoading$ = store.select(fromStatementAssignmentsReducers.getAssignEmployeesLoading);
    this.assignEmployeesError$ = store.select(fromStatementAssignmentsReducers.getAssignEmployeesError);
    this.assignAllEmployeesLoading$ = store.select(fromStatementAssignmentsReducers.getAssignAllEmployeesLoading);
    this.assignAllEmployeesError$ = store.select(fromStatementAssignmentsReducers.getAssignAllEmployeesError);
  }

  ngOnInit(): void {
    this.isOpen$ = this.store.pipe(select(fromStatementAssignmentsReducers.getIsAssignmentsModalOpen));
    this.numberOfResults$ = this.store.pipe(select(fromSearchReducer.getNumberOfResultsOnServer));

    this.assignedEmployeesCountSubscription = this.statement$.subscribe(statement =>
      this.assignedEmployeesCount = statement?.AssignedCompanyEmployeeIds?.length || 0);
    this.selectedEmployeesCountSubscription = this.selectedEmployeesCount$.subscribe(count => this.selectedEmployeesCount = count);
    this.searchResultsCountSubscription = this.searchResultsCount$.subscribe(count => this.searchResultsCount = count);
  }

  ngOnDestroy(): void {
    this.assignedEmployeesCountSubscription.unsubscribe();
    this.selectedEmployeesCountSubscription.unsubscribe();
    this.searchResultsCountSubscription.unsubscribe();
  }

  onSetContext(payload: any): void {
    this.store.dispatch(new fromStatementAssignmentModalActions.SetContext(payload));
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(this.staticFilters));
  }

  onResetApp(): void {
    this.store.dispatch(new fromStatementAssignmentModalActions.ResetState());
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
    this.store.dispatch(new fromEmployeeSearchResultsActions.ClearSelectedEmployees());
    this.store.dispatch(new fromEmployeeSearchResultsActions.ClearEmployeeResults());
  }

  onCloseModal(closeType: 'save' | 'discard') {
    this.store.dispatch(new fromStatementAssignmentModalActions.CloseModal());
  }

  onSubmitSelectedEmployees() {
    this.store.dispatch(new fromStatementAssignmentModalActions.AssignEmployees());
  }

  canAssignEmployees() {
    return this.selectedEmployeesCount && !this.hasReachedEmployeesLimit;
  }

  get hasReachedEmployeesLimit(): boolean {
    return this.selectedEmployeesCount + this.assignedEmployeesCount > this.statementAssignmentMax;
  }

  get displayEmployeesLimitInfoMessage(): boolean {
    return !this.hasReachedEmployeesLimit && this.searchResultsCount + this.assignedEmployeesCount > this.statementAssignmentMax;
  }

  handleClearSelectedEmployees(): void {
    this.store.dispatch(new fromEmployeeSearchResultsActions.ClearSelectedEmployees());
  }

  handleAddAllEmployees(): void {
    this.store.dispatch(new fromStatementAssignmentModalActions.AssignAllEmployees({ assignmentMax: this.getAssignmentMaximum() }));
  }

  getPrimaryButtonText(): string {
    if (this.selectedEmployeesCount) {
      return 'Assign (' + this.selectedEmployeesCount + ')';
    }
    return 'Assign';
  }

  getAssignmentMaximum() {
    return this.searchResultsCount + this.assignedEmployeesCount > this.statementAssignmentMax
      ? StatementAssignmentConfig.statementAssignmentMax - this.assignedEmployeesCount
      : this.searchResultsCount;
  }
}
