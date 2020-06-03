import {Component, OnInit, ViewChild} from '@angular/core';

import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';

import * as fromStatementListReducers from '../reducers';
import * as fromStatementListPageActions from '../actions/statement-list.page.actions';
import * as fromStatementGridActions from '../actions/statement-grid.actions';
import * as fromTemplateSelectorActions from '../actions/template-selector.actions';
import { StatementListViewModel } from '../../../shared/models';

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

  isDeleteStatetementModalOpen$: Observable<boolean>;
  deletingStatement$: Observable<boolean>;
  deletingStatementSuccess$: Observable<boolean>;
  deletingStatementError$: Observable<boolean>;
  openActionMenuStatement$: Observable<StatementListViewModel>;

  @ViewChild('tabs')
  tabs: NgbTabset;

  constructor(private store: Store<fromStatementListReducers.State>) { }

  ngOnInit(): void {
    this.focusedTab$ = this.store.pipe(select(fromStatementListReducers.getFocusedTab));
    this.statementsLoading$ = this.store.pipe(select(fromStatementListReducers.getStatementsLoading));
    this.statementsLoadingError$ = this.store.pipe(select(fromStatementListReducers.getStatementsLoadingError));
    this.statementsTotal$ = this.store.pipe(select(fromStatementListReducers.getStatementsTotal));
    this.statementsSearchTerm$ = this.store.pipe(select(fromStatementListReducers.getStatementsSearchTerm));

    this.isDeleteStatetementModalOpen$ = this.store.pipe(select(fromStatementListReducers.getIsDeleteStatetementModalOpen));
    this.deletingStatement$ = this.store.pipe(select(fromStatementListReducers.getDeletingStatetement));
    this.deletingStatementSuccess$ = this.store.pipe(select(fromStatementListReducers.getDeletingStatetementSuccess));
    this.deletingStatementError$ = this.store.pipe(select(fromStatementListReducers.getDeletingStatetementError));
    this.openActionMenuStatement$ = this.store.pipe(select(fromStatementListReducers.getStatementsOpenActionMenuStatement));

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

  onTemplateSelected(templateId: string) {
    this.store.dispatch(new fromTemplateSelectorActions.CreateStatement({ templateId }));
  }

  onConfirmDeleteStatement() {
    this.store.dispatch(new fromStatementGridActions.DeleteStatement());
  }

  onCancelDeleteStatement() {
    this.store.dispatch(new fromStatementGridActions.CloseDeleteStatement());
  }
}
