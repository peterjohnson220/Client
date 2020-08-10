import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as cloneDeep from 'lodash.clonedeep';

import { Observable, Subscription, Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { FilterDescriptor, State } from '@progress/kendo-data-query';

import { CompanyEmployee } from 'libs/models/company';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import { AppNotification } from 'libs/features/app-notifications/models';
import { AsyncStateObj } from 'libs/models/state';

import * as fromPageReducer from '../reducers';
import * as fromPageActions from '../actions/statement-assignment.page.actions';
import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';
import * as fromAssignmentsModalActions from '../actions/statement-assignment-modal.actions';
import { StatementAssignmentModalComponent } from '../containers/statement-assignment-modal';
import { Statement } from '../../../shared/models';
import { TotalRewardsAssignmentService } from '../../../shared/services/total-rewards-assignment.service';


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
  getNotification$: Observable<AppNotification<any>[]>;
  isExportingAssignedEmployees$: Observable<boolean>;
  exportEventId$: Observable<AsyncStateObj<string>>;

  assignedEmployeesSelectedCompanyEmployeeIds$: Observable<number[]>;

  isUnassignEmployeesModalOpen$: Observable<boolean>;
  sendingUnassignRequest$: Observable<boolean>;
  sendingUnassignRequestSuccess$: Observable<boolean>;
  sendingUnassignRequestError$: Observable<boolean>;
  isSingleEmployeeAction$: Observable<boolean>;
  openActionMenuEmployee$: Observable<CompanyEmployee>;
  unassignEmployeesSuccess$: Observable<boolean>;

  assignedEmployeesLoading$: Observable<boolean>;
  assignedEmployeesTotal$: Observable<number>;
  assignedEmployeesListAreaColumns$: Observable<any[]>;

  employeeSearchTerm$: Observable<string>;

  statement: Statement;
  assignedEmployeesGridState = TotalRewardsAssignmentService.defaultAssignedEmployeesGridState;

  statementSubscription$ = new Subscription();
  routeParamSubscription$ = new Subscription();
  filterChangeSubscription = new Subscription();
  unassignEmployeesSuccessSubscription = new Subscription();
  assignedEmployeesTotalSubscription = new Subscription();
  appNotificationSubscription: Subscription;
  exportEventIdSubscription: Subscription;

  filterChangeSubject = new Subject<FilterDescriptor[]>();
  exportEventId = null;

  constructor(
    private store: Store<fromPageReducer.State>,
    private route: ActivatedRoute, private router: Router,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>,
  ) { }

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
    this.employeeSearchTerm$ = this.store.pipe(select(fromPageReducer.getEmployeeSearchTerm));
    this.isExportingAssignedEmployees$ = this.store.pipe(select(fromPageReducer.getIsExportingAssignedEmployees));

    // Generate Modal
    this.isGenerateStatementModalOpen$ = this.store.pipe(select(fromPageReducer.getIsGenerateStatementModalOpen));
    this.sendingGenerateRequest$ = this.store.pipe(select(fromPageReducer.getSendingGenerateStatementRequest));
    this.sendingGenerateRequestSuccess$ = this.store.pipe(select(fromPageReducer.getSendingGenerateStatementRequestSuccess));
    this.sendingGenerateRequestError$ = this.store.pipe(select(fromPageReducer.getSendingGenerateStatementRequestError));
    this.getIsFiltersPanelOpen$ = this.store.pipe(select(fromPageReducer.getIsFiltersPanelOpen));
    this.getNotification$ = this.appNotificationStore.pipe(select(fromAppNotificationsMainReducer.getNotifications));

    // Unassign Modal
    this.isUnassignEmployeesModalOpen$ = this.store.pipe(select(fromPageReducer.getIsUnassignEmployeesModalOpen));
    this.sendingUnassignRequest$ = this.store.pipe(select(fromPageReducer.getSendingUnassignRequest));
    this.sendingUnassignRequestSuccess$ = this.store.pipe(select(fromPageReducer.getSendingUnassignRequestSuccess));
    this.sendingUnassignRequestError$ = this.store.pipe(select(fromPageReducer.getSendingUnassignRequestError));
    this.isSingleEmployeeAction$ = this.store.pipe(select(fromPageReducer.getIsSingleEmployeeAction));
    this.openActionMenuEmployee$ = this.store.pipe(select(fromPageReducer.getOpenActionMenuEmployee));
    this.unassignEmployeesSuccess$ = this.store.pipe(select(fromPageReducer.getSendingUnassignRequestSuccess));

    // assigned employees
    this.assignedEmployeesSelectedCompanyEmployeeIds$ = this.store.pipe(select(fromPageReducer.getAssignedEmployeesSelectedCompanyEmployeeIds));
    this.assignedEmployeesLoading$ = this.store.pipe(select(fromPageReducer.getAssignedEmployeesLoading));
    this.assignedEmployeesTotal$ = this.store.pipe(select(fromPageReducer.getAssignedEmployeesTotal));
    this.assignedEmployeesListAreaColumns$ = this.store.pipe(select(fromPageReducer.getListAreaColumns));

    // exports
    this.exportEventId$ = this.store.pipe(select(fromPageReducer.getExportEventAsync));

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
      this.assignedEmployeesGridState.skip = 0;
      this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees(this.assignedEmployeesGridState));
    });
    this.unassignEmployeesSuccessSubscription = this.unassignEmployeesSuccess$.subscribe(u => {
      if (u) {
        this.assignedEmployeesGridState = cloneDeep(this.assignedEmployeesGridState);
        this.assignedEmployeesGridState.skip = 0;
        this.assignedEmployeesGridState.take = TotalRewardsAssignmentService.defaultAssignedEmployeesGridState.take;
      }
    });
    this.exportEventIdSubscription = this.exportEventId$.subscribe(eventId => {
      if (eventId?.obj !== this.exportEventId) {
        this.exportEventId = eventId.obj;
      }
    });
    this.appNotificationSubscription = this.getNotification$.subscribe(notification => {
      const successNotification = notification.find((x) => x.Level === 'Success' && x.NotificationId === this.exportEventId) ;
      if (successNotification) {
        this.store.dispatch(new fromPageActions.ExportAssignedEmployeesComplete());
      }
    });

    // dispatches, search init
    this.store.dispatch(new fromPageActions.LoadAssignedEmployeesListAreaColumns());
    this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees(this.assignedEmployeesGridState));
    this.store.dispatch(new fromPageActions.GetExportingAssignedEmployee());

    this.setSearchContext();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignedEmployeesTotalSubscription = this.assignedEmployeesTotal$.subscribe(count => {
        if (count === 0) {
          this.store.dispatch(new fromAssignmentsModalActions.OpenModal());
        } else {
          this.store.dispatch(new fromAssignmentsModalActions.CloseModal());
        }
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this.statementSubscription$.unsubscribe();
    this.assignedEmployeesTotalSubscription.unsubscribe();
    this.routeParamSubscription$.unsubscribe();
    this.exportEventIdSubscription.unsubscribe();
    this.appNotificationSubscription.unsubscribe();
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

  handleOpenUnassignModalClick() {
    this.store.dispatch(new fromPageActions.OpenUnassignModal());
  }

  handleUnassignEmployeesClick() {
    this.store.dispatch(new fromPageActions.UnassignEmployees());
  }

  handleCancelUnassignEmployeesModal() {
    this.store.dispatch(new fromPageActions.CloseUnassignModal());
    this.store.dispatch(new fromAssignedEmployeesGridActions.CloseActionMenu());
  }

  handleClearSelectionsClick() {
    this.store.dispatch(new fromAssignedEmployeesGridActions.ClearSelections());
  }

  // footer methods
  handleOpenGenerateStatementModalClick() {
    this.store.dispatch(new fromPageActions.OpenGenerateStatementModal());
  }

  handleBackToCanvasClick() {
    this.router.navigate(['/statement/edit/' + this.statement.StatementId]);
  }

  onSearchTermChange(searchTerm: string) {
    this.store.dispatch(new fromAssignedEmployeesGridActions.UpdateEmployeeSearchTerm({ searchTerm, gridState: this.assignedEmployeesGridState }));
  }

  handleExportClicked() {
    this.store.dispatch(new fromPageActions.ExportAssignedEmployees());
  }
}
