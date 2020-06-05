import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Observable, Subscription, of} from 'rxjs';
import {Store, select} from '@ngrx/store';

import * as fromPageReducer from '../reducers';
import * as fromPageActions from '../actions/statement-assignment.page.actions';
import * as fromAssignmentsModalActions from '../actions/statement-assignment-modal.actions';
import { StatementAssignmentModalComponent } from '../containers/statement-assignment-modal';
import { Statement } from '../../../shared/models';

@Component({
  selector: 'pf-statement-assignment-page',
  templateUrl: './statement-assignment.page.html',
  styleUrls: ['./statement-assignment.page.scss']
})
export class StatementAssignmentPageComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(StatementAssignmentModalComponent, {static: true}) public StatementAssignmentModalComponent: StatementAssignmentModalComponent;

  statement$: Observable<Statement>;
  isGenerateStatementModalOpen$: Observable<boolean>;
  sendingGenerateRequest$: Observable<boolean>;
  sendingGenerateRequestSuccess$: Observable<boolean>;
  sendingGenerateRequestError$: Observable<boolean>;
  selectedCompanyEmployeeIds$: Observable<number[]>;

  routeParamSubscription$ = new Subscription();
  queryParamSubscription$ = new Subscription();

  constructor(private store: Store<fromPageReducer.State>, private route: ActivatedRoute, private router: Router) { }

  private setSearchContext() {
    const setContextMessage: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: {}
        }
      }
    } as MessageEvent;
    this.StatementAssignmentModalComponent.onMessage(setContextMessage);
  }

  ngOnInit(): void {
    this.statement$ = this.store.pipe(select(fromPageReducer.getStatement));
    this.isGenerateStatementModalOpen$ = this.store.pipe(select(fromPageReducer.getIsGenerateStatementModalOpen));
    this.sendingGenerateRequest$ = this.store.pipe(select(fromPageReducer.getSendingGenerateStatementRequest));
    this.sendingGenerateRequestSuccess$ = this.store.pipe(select(fromPageReducer.getSendingGenerateStatementRequestSuccess));
    this.sendingGenerateRequestError$ = this.store.pipe(select(fromPageReducer.getSendingGenerateStatementRequestError));
    this.selectedCompanyEmployeeIds$ = this.store.pipe(select(fromPageReducer.getAssignmentsGridSelectedCompanyEmployeeIds));

    this.routeParamSubscription$ = this.route.params.subscribe(params => {
      this.store.dispatch(new fromPageActions.LoadStatement({ statementId: params['id'] }));
    });

    this.setSearchContext();
  }

  ngAfterViewInit(): void {
    this.queryParamSubscription$ = this.route.queryParams.subscribe( queryParams => {
      if (queryParams['openModal'] && (queryParams['openModal'] === '1')) {
        this.store.dispatch(new fromAssignmentsModalActions.OpenModal());
      }
    });
  }

  ngOnDestroy(): void {
    this.routeParamSubscription$.unsubscribe();
    this.queryParamSubscription$.unsubscribe();
    this.store.dispatch(new fromPageActions.ResetState());
  }

  openAssignModal(): void {
    this.setSearchContext();
    this.store.dispatch(new fromAssignmentsModalActions.OpenModal());
  }

  handleCancelGenerateStatementModal() {
    this.store.dispatch(new fromPageActions.CloseGenerateStatementModal());
  }

  handleGenerateStatementsClick() {
    this.store.dispatch(new fromPageActions.GenerateStatements());
  }

  // footer methods
  handleOpenGenerateStatementModalClick() {
    this.store.dispatch(new fromPageActions.OpenGenerateStatementModal());
  }

  handleAssignEmployeesClick() {
    this.store.dispatch(new fromAssignmentsModalActions.OpenModal());
  }
}
