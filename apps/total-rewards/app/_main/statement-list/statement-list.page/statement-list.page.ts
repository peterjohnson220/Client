import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { StatementListViewModel } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromStatementListReducers from '../reducers';
import * as fromStatementListPageActions from '../actions/statement-list.page.actions';
import * as fromStatementGridActions from '../actions/statement-grid.actions';
import * as fromTemplateSelectorActions from '../actions/template-selector.actions';

@Component({
  selector: 'pf-total-rewards-statement-list-page',
  templateUrl: './statement-list.page.html',
  styleUrls: ['./statement-list.page.scss']
})
export class StatementListPageComponent implements OnInit, OnDestroy {

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

  urlParamSubscription = new Subscription();

  constructor(
    private store: Store<fromStatementListReducers.State>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.focusedTab$ = this.store.pipe(select(fromStatementListReducers.getFocusedTab));
    this.statementsLoading$ = this.store.pipe(select(fromStatementListReducers.getStatementsLoading));
    this.statementsLoadingError$ = this.store.pipe(select(fromStatementListReducers.getStatementsLoadingError));
    this.statementsTotal$ = this.store.pipe(select(fromStatementListReducers.getStatementsTotal));
    this.statementsSearchTerm$ = this.store.pipe(select(fromStatementListReducers.getStatementsSearchTerm));

    this.isDeleteStatetementModalOpen$ = this.store.pipe(select(fromStatementListReducers.getIsDeleteStatementModalOpen));
    this.deletingStatement$ = this.store.pipe(select(fromStatementListReducers.getDeletingStatement));
    this.deletingStatementSuccess$ = this.store.pipe(select(fromStatementListReducers.getDeletingStatementSuccess));
    this.deletingStatementError$ = this.store.pipe(select(fromStatementListReducers.getDeletingStatementError));
    this.openActionMenuStatement$ = this.store.pipe(select(fromStatementListReducers.getStatementsOpenActionMenuStatement));

    // SUBSCRIPTIONS
    this.urlParamSubscription = this.route.url.subscribe(params => {
      // <host>/client/total-rewards/ => params.length === 0
      // <host>/client/total-rewards/templates => params.length === 1
      const tabSegment = params.length ? params[0].path : '';
      this.dispatchSegmentAction(tabSegment);
    });
  }

  ngOnDestroy(): void {
    this.urlParamSubscription.unsubscribe();
  }

  onSearchTermChange(searchTerm: string): void {
    this.store.dispatch(new fromStatementGridActions.UpdateSearchTerm(searchTerm));
  }

  onTabChange(tab: TabSegment): void  {
    switch (tab) {
      case '':
        this.router.navigate(['']);
        break;

      case 'templates':
        this.router.navigate(['templates']);
        break;
    }
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

  private dispatchSegmentAction(tabSegment: string): void {
    const isStatementsTab = (tabSegment ?? '') === '';
    const isTemplatesTab = tabSegment?.toLowerCase() === 'templates';

    if (isStatementsTab) {
      this.store.dispatch(new fromStatementListPageActions.SetTab('Statements'));
      this.store.dispatch(new fromStatementGridActions.LoadStatements());
    } else if (isTemplatesTab) {
      this.store.dispatch(new fromStatementListPageActions.SetTab('Templates'));
      this.store.dispatch(new fromTemplateSelectorActions.LoadTemplates());
    }
  }
}

export type TabSegment = '' | 'templates';
