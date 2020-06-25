import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { SearchBase } from 'libs/features/search/containers/search-base';
import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models/security';
import {Filter, FilterType, MultiSelectFilter, TextFilter} from 'libs/features/search/models';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';

import * as fromStatementAssignmentsReducers from '../../reducers';
import * as fromStatementAssignmentModalActions from '../../actions/statement-assignment-modal.actions';
import * as fromEmployeeSearchResultsActions from '../../actions/employee-search-results.actions';

@Component({
  selector: 'pf-statement-assignment-modal',
  templateUrl: './statement-assignment-modal.component.html',
  styleUrls: ['./statement-assignment-modal.component.scss']
})
export class StatementAssignmentModalComponent extends SearchBase implements OnInit {

  isOpen$: Observable<boolean>;
  numberOfResults$: Observable<number>;
  userContext$: Observable<UserContext>;
  searchingFilter$: Observable<boolean>;

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

  constructor(store: Store<fromSearchReducer.State>) {
    super(store);
    this.userContext$ = store.select(fromRootState.getUserContext);
  }

  ngOnInit(): void {
    this.isOpen$ = this.store.pipe(select(fromStatementAssignmentsReducers.getIsAssignmentsModalOpen));
    this.numberOfResults$ = this.store.pipe(select(fromSearchReducer.getNumberOfResultsOnServer));
  }

  onSetContext(payload: any): void {
    this.store.dispatch(new fromStatementAssignmentModalActions.SetContext(payload));
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(this.staticFilters));
  }

  onResetApp(): void {
    this.store.dispatch(new fromStatementAssignmentModalActions.ResetState());
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
    this.store.dispatch(new fromEmployeeSearchResultsActions.ClearEmployeeResults());
  }

  onCloseModal(closeType: 'save' | 'discard') {
    this.store.dispatch(new fromStatementAssignmentModalActions.CloseModal());
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
    this.store.dispatch(new fromEmployeeSearchResultsActions.ClearEmployeeResults());
  }
}
