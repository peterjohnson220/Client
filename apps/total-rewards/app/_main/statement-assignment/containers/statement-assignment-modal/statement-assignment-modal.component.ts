import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromStatementAssignmentsReducers from '../../reducers';
import * as fromStatementAssignmentModalActions from '../../actions/statement-assignment-modal.actions';
import * as fromEmployeeSearchResultsActions from '../../actions/employee-search-results.actions';


@Component({
  selector: 'pf-statement-assignment-modal',
  templateUrl: './statement-assignment-modal.component.html',
  styleUrls: ['./statement-assignment-modal.component.scss']
})
export class StatementAssignmentModalComponent implements OnInit, OnDestroy {

  isOpen$: Observable<boolean>;
  numberOfResults$: Observable<number>;

  constructor(private store: Store<fromStatementAssignmentsReducers.State>, private searchStore: Store<fromSearchReducer.State>) {}

  ngOnInit(): void {
    this.store.dispatch(new fromSearchResultsActions.GetResults({keepFilteredOutOptions: false}));
    this.isOpen$ = this.store.pipe(select(fromStatementAssignmentsReducers.getIsAssignmentsModalOpen));
    this.numberOfResults$ = this.searchStore.pipe(select(fromSearchReducer.getNumberOfResultsOnServer));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromStatementAssignmentModalActions.ResetState());
    this.searchStore.dispatch(new fromSearchResultsActions.ClearResults());
    this.store.dispatch(new fromEmployeeSearchResultsActions.ClearEmployeeResults());
  }

  onCloseModal(closeType: 'save' | 'discard') {
    this.store.dispatch(new fromStatementAssignmentModalActions.CloseModal());
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
    this.store.dispatch(new fromEmployeeSearchResultsActions.ClearEmployeeResults());
  }
}
