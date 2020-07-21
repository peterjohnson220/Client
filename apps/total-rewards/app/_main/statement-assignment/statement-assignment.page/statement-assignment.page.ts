import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as cloneDeep from 'lodash.clonedeep';

import { Observable, Subscription, Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime, take, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { FilterDescriptor, State } from '@progress/kendo-data-query';

import * as fromPageReducer from '../reducers';
import * as fromPageActions from '../actions/statement-assignment.page.actions';
import * as fromAssignmentsModalActions from '../actions/statement-assignment-modal.actions';
import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';
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
  getIsFiltersPanelOpen$: Observable<boolean>;

  assignedEmployeesSelectedCompanyEmployeeIds$: Observable<number[]>;
  assignedEmployeesLoading$: Observable<boolean>;
  assignedEmployeesTotal$: Observable<number>;
  assignedEmployeesListAreaColumns$: Observable<any[]>;

  statement: Statement;
  assignedEmployeesGridState: any = {
    skip: 0,
    take: 20,
    filter: {
      filters: [],
      logic: 'and'
    },
    sort: []
  };

  statementSubscription$ = new Subscription();
  routeParamSubscription$ = new Subscription();
  queryParamSubscription$ = new Subscription();
  filterChangeSubscription = new Subscription();

  filterChangeSubject = new Subject<FilterDescriptor[]>();

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

  // lifecycle methods
  ngOnInit(): void {
    // observables
    this.statement$ = this.store.pipe(select(fromPageReducer.getStatement));
    this.isGenerateStatementModalOpen$ = this.store.pipe(select(fromPageReducer.getIsGenerateStatementModalOpen));
    this.sendingGenerateRequest$ = this.store.pipe(select(fromPageReducer.getSendingGenerateStatementRequest));
    this.sendingGenerateRequestSuccess$ = this.store.pipe(select(fromPageReducer.getSendingGenerateStatementRequestSuccess));
    this.sendingGenerateRequestError$ = this.store.pipe(select(fromPageReducer.getSendingGenerateStatementRequestError));
    this.getIsFiltersPanelOpen$ = this.store.pipe(select(fromPageReducer.getIsFiltersPanelOpen));

    // observables, assigned employees
    this.assignedEmployeesSelectedCompanyEmployeeIds$ = this.store.pipe(select(fromPageReducer.getAssignedEmployeesSelectedCompanyEmployeeIds));
    this.assignedEmployeesLoading$ = this.store.pipe(select(fromPageReducer.getAssignedEmployeesLoading));
    this.assignedEmployeesTotal$ = this.store.pipe(select(fromPageReducer.getAssignedEmployeesTotal));
    this.assignedEmployeesListAreaColumns$ = this.store.pipe(select(fromPageReducer.getListAreaColumns));

    // subscriptions
    this.routeParamSubscription$ = this.route.params.subscribe(params => {
      this.store.dispatch(new fromPageActions.LoadStatement({ statementId: params['id'] }));
    });
    this.statementSubscription$ = this.statement$.subscribe(s => this.statement = s);
    this.filterChangeSubscription = this.filterChangeSubject.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe((filters: FilterDescriptor[]) => {
      // the filters component mutates the gridState's filters directly so workaround a potential read only error by cloning
      this.assignedEmployeesGridState = cloneDeep(this.assignedEmployeesGridState);
      this.assignedEmployeesGridState.filter.filters = filters;
      this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees(this.assignedEmployeesGridState));
    });

    // dispatches, search init
    this.store.dispatch(new fromPageActions.LoadAssignedEmployeesListAreaColumns());
    this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees(this.assignedEmployeesGridState));

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
    this.statementSubscription$.unsubscribe();
    this.routeParamSubscription$.unsubscribe();
    this.queryParamSubscription$.unsubscribe();
    this.store.dispatch(new fromPageActions.ResetState());
  }

  // handler methods
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

  handleAssignEmployeesClick() {
    this.store.dispatch(new fromAssignmentsModalActions.OpenModal());
  }

  handleAssignedEmployeesGridStateChange($event: State) {
    // the filters component mutates the gridState's filters directly so workaround a potential read only error by cloning
    const currentFilter = cloneDeep(this.assignedEmployeesGridState.filter);
    this.assignedEmployeesGridState = cloneDeep($event);
    this.assignedEmployeesGridState.filter = currentFilter;
    this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees(this.assignedEmployeesGridState));
  }

  // filter handler methods
  handleFilterChanged(filters: FilterDescriptor[]) {
    this.filterChangeSubject.next(filters);
  }

  handleFiltersClose() {
    this.store.dispatch(new fromPageActions.ToggleGridFilters());
  }

  handleFiltersToggle() {
    this.store.dispatch(new fromPageActions.ToggleGridFilters());
  }

  handleClearFilter(filterDescriptor: FilterDescriptor) {
    // the filters component mutates the gridState's filters directly so workaround a potential read only error by cloning
    this.assignedEmployeesGridState = cloneDeep(this.assignedEmployeesGridState);
    this.assignedEmployeesGridState.filter.filters = this.assignedEmployeesGridState.filter.filters.filter(f => f.field !== filterDescriptor.field);
    this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees(this.assignedEmployeesGridState));
  }

  handleClearAllFilters() {
    // the filters component mutates the gridState's filters directly so workaround a potential read only error by cloning
    this.assignedEmployeesGridState = cloneDeep(this.assignedEmployeesGridState);
    this.assignedEmployeesGridState.filter.filters = [];
    this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees(this.assignedEmployeesGridState));
  }

  // footer handler methods
  handleOpenGenerateStatementModalClick() {
    this.store.dispatch(new fromPageActions.OpenGenerateStatementModal());
  }

  handleBackToCanvasClick() {
    this.router.navigate(['/statement/edit/' + this.statement.StatementId]);
  }
}
