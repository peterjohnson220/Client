import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';


import * as fromStatementAssignmentsReducers from '../../reducers';
import * as fromActions from '../../actions/statement-assignment-modal.actions';

@Component({
  selector: 'pf-statement-assignment-modal',
  templateUrl: './statement-assignment-modal.component.html',
  styleUrls: ['./statement-assignment-modal.component.scss']
})
export class StatementAssignmentModalComponent implements OnInit, OnDestroy {

  isOpen$: Observable<boolean>;

  constructor(private store: Store<fromStatementAssignmentsReducers.State>) {}

  ngOnInit(): void {
    this.isOpen$ = this.store.pipe(select(fromStatementAssignmentsReducers.getIsAssignmentsModalOpen));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromActions.ResetState());
  }

  onCloseModal(closeType: 'save' | 'discard') {
    this.store.dispatch(new fromActions.CloseModal());
  }
}
