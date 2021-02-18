import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { FilterDescriptor, State } from '@progress/kendo-data-query';

import { StatementEmailTemplate, TotalRewardAssignedEmployee } from 'libs/models/payfactors-api/total-rewards';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import { AppNotification } from 'libs/features/infrastructure/app-notifications/models';
import { AsyncStateObj } from 'libs/models/state';
import { GridTypeEnum, ListAreaColumn, FileDownloadSecurityWarningType } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { TotalRewardsAssignmentService } from 'libs/features/total-rewards/total-rewards-statement/services/total-rewards-assignment.service';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';

import * as fromPageReducer from '../reducers';
import * as fromPageActions from '../actions/statement-assignment.page.actions';
import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';
import * as fromAssignmentsModalActions from '../actions/statement-assignment-modal.actions';
import * as fromGenerateStatementModalActions from '../actions/generate-statement-modal.actions';
import { StatementAssignmentModalComponent } from '../containers/statement-assignment-modal';
import { DeliveryOption, StatementAssignmentConfig } from '../models';

@Component({
  selector: 'pf-statement-assignment-page',
  templateUrl: './statement-assignment.page.html',
  styleUrls: ['./statement-assignment.page.scss']
})
export class StatementAssignmentPageComponent implements OnDestroy, OnInit {
  @ViewChild(StatementAssignmentModalComponent, {static: true}) public StatementAssignmentModalComponent: StatementAssignmentModalComponent;
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) public fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;

  statement$: Observable<Statement>;

  isGenerateStatementModalOpen$: Observable<boolean>;
  sendingGenerateRequest$: Observable<boolean>;
  sendingGenerateRequestSuccess$: Observable<boolean>;
  sendingGenerateRequestError$: Observable<boolean>;
  getIsFiltersPanelOpen$: Observable<boolean>;
  getNotification$: Observable<AppNotification<any>[]>;
  isExportingAssignedEmployees$: Observable<boolean>;
  exportEventId$: Observable<AsyncStateObj<string>>;
  statementEmailTemplate$: Observable<StatementEmailTemplate>;
  enableFileDownloadSecurityWarning$: Observable<boolean>;

  assignedEmployeesSelectedCompanyEmployeeIds$: Observable<number[]>;

  isUnassignEmployeesModalOpen$: Observable<boolean>;
  sendingUnassignRequest$: Observable<boolean>;
  sendingUnassignRequestSuccess$: Observable<boolean>;
  sendingUnassignRequestError$: Observable<boolean>;
  isSingleEmployeeAction$: Observable<boolean>;
  openActionMenuEmployee$: Observable<TotalRewardAssignedEmployee>;
  unassignEmployeesSuccess$: Observable<boolean>;

  assignedEmployeesLoading$: Observable<boolean>;
  assignedEmployeesTotal$: Observable<number>;
  assignedEmployeesTotalOrSelectedCount$: Observable<number>;
  assignedEmployeesListAreaColumns$: Observable<ListAreaColumn[]>;

  savingGridColumns$: Observable<boolean>;
  savingGridColumnsError$: Observable<boolean>;

  employeeSearchTerm$: Observable<string>;
  electronicDeliveryFeatureFlagEnabled: boolean;

  statement: Statement;
  assignedEmployeesGridState = TotalRewardsAssignmentService.defaultAssignedEmployeesGridState;

  statementSubscription$ = new Subscription();
  routeParamSubscription$ = new Subscription();
  filterChangeSubscription = new Subscription();
  unassignEmployeesSuccessSubscription = new Subscription();
  appNotificationSubscription: Subscription;
  exportEventIdSubscription: Subscription;
  enableFileDownloadSecurityWarningSubscription: Subscription;

  exportEventId = null;
  filterChangeSubject = new BehaviorSubject<FilterDescriptor[]>([]);
  filters$: Observable<FilterDescriptor[]>;
  isChangingFilters: boolean;
  statementAssignmentMax = StatementAssignmentConfig.statementAssignmentMax;
  enableFileDownloadSecurityWarning: boolean;
  deliveryOption: DeliveryOption;
  securityWarningType: FileDownloadSecurityWarningType;
  private readonly FILTER_DEBOUNCE_TIME = 400;

  constructor(
    private store: Store<fromPageReducer.State>,
    private route: ActivatedRoute, private router: Router,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>,
    private featureFlagService: AbstractFeatureFlagService,
    private settingsService: SettingsService
  ) {
    this.filters$ = this.filterChangeSubject.asObservable();
    this.electronicDeliveryFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.TotalRewardsElectronicDelivery, false);
    this.enableFileDownloadSecurityWarning$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
  }

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
    this.statementEmailTemplate$ = this.store.pipe(select(fromPageReducer.getStatementEmailTemplate));

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
    this.assignedEmployeesTotalOrSelectedCount$ = this.store.pipe(select(fromPageReducer.getAssignedEmployeesTotalOrSelectedCount));
    this.assignedEmployeesListAreaColumns$ = this.store.pipe(select(fromPageReducer.getGridColumns));

    // exports
    this.exportEventId$ = this.store.pipe(select(fromPageReducer.getExportEventAsync));

    // Column Chooser
    this.savingGridColumns$ = this.store.pipe(select(fromPageReducer.getSavingGridColumns));
    this.savingGridColumnsError$ = this.store.pipe(select(fromPageReducer.getSavingGridColumnsError));

    // subscriptions
    this.routeParamSubscription$ = this.route.params.subscribe(params => {
      this.store.dispatch(new fromPageActions.LoadStatement({ statementId: params['id'] }));
      if (this.electronicDeliveryFeatureFlagEnabled) {
        this.store.dispatch(new fromGenerateStatementModalActions.GetStatementEmailTemplate({ statementId: params['id'] }));
      }
    });
    this.statementSubscription$ = this.statement$.subscribe(s => this.statement = s);
    this.filterChangeSubscription = this.filterChangeSubject.pipe(
      distinctUntilChanged(),
      debounceTime(this.FILTER_DEBOUNCE_TIME)
    ).subscribe((filters: FilterDescriptor[]) => {
      if (!this.isChangingFilters) {
        return;
      }
      this.isChangingFilters = false;
      // the filters component mutates the gridState's filters directly so workaround a potential read only error by cloning
      this.assignedEmployeesGridState = cloneDeep(this.assignedEmployeesGridState);
      this.assignedEmployeesGridState.filter.filters = filters;
      this.assignedEmployeesGridState.skip = 0;
      this.refreshGrid();
    });
    this.unassignEmployeesSuccessSubscription = this.unassignEmployeesSuccess$.subscribe(u => {
      if (u) {
        this.assignedEmployeesGridState = cloneDeep(this.assignedEmployeesGridState);
        this.assignedEmployeesGridState.skip = 0;
      }
    });
    this.exportEventIdSubscription = this.exportEventId$.subscribe(eventId => {
      if (eventId?.obj !== this.exportEventId) {
        this.exportEventId = eventId.obj;
      }
    });
    this.enableFileDownloadSecurityWarningSubscription = this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
        this.enableFileDownloadSecurityWarning = isEnabled;
    });

    const processedNotificationIds = [];
    this.appNotificationSubscription = this.getNotification$.subscribe(notifications => {
      notifications.forEach(notification => {
        if (notification.Level === 'Success' && notification.NotificationId === this.exportEventId) {
          this.store.dispatch(new fromPageActions.ExportAssignedEmployeesComplete());
        } else if (notification?.Payload?.StatementId === this.statement.StatementId && typeof notification?.Payload?.IsStatementGenerating === 'boolean') {
          if (!processedNotificationIds.find(n => n === notification.NotificationId)) {
            processedNotificationIds.push(notification.NotificationId);
            this.store.dispatch(new fromPageActions.UpdateStatementIsGenerating(notification.Payload.IsStatementGenerating));
          }
        }
      });
    });

    // dispatches, search init
    this.store.dispatch(new fromPageActions.LoadAssignedEmployeesListAreaColumns());
    this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees(this.assignedEmployeesGridState));
    this.store.dispatch(new fromPageActions.GetExportingAssignedEmployee());

    this.setSearchContext();
  }

  ngOnDestroy(): void {
    this.statementSubscription$.unsubscribe();
    this.routeParamSubscription$.unsubscribe();
    this.exportEventIdSubscription.unsubscribe();
    this.appNotificationSubscription.unsubscribe();
    this.unassignEmployeesSuccessSubscription.unsubscribe();
    this.filterChangeSubscription.unsubscribe();
    this.enableFileDownloadSecurityWarningSubscription.unsubscribe();
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

  handleGenerateStatementsClick(deliveryOption: DeliveryOption) {
    this.deliveryOption = deliveryOption;
    if (this.enableFileDownloadSecurityWarning && !deliveryOption.EmailTemplate) {
      this.store.dispatch(new fromPageActions.CloseGenerateStatementModal());
      this.securityWarningType = FileDownloadSecurityWarningType.TotalRewardsStatement;
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.store.dispatch(new fromPageActions.GenerateStatements({ method: this.deliveryOption.Method, emailTemplate: this.deliveryOption.EmailTemplate }));
    }

    if (deliveryOption.SaveEmailTemplate && deliveryOption.EmailTemplate) {
      this.store.dispatch(new fromGenerateStatementModalActions.SaveStatementEmailTemplate(deliveryOption.EmailTemplate));
    }
  }

  handleAssignEmployeesClick() {
    this.store.dispatch(new fromAssignmentsModalActions.OpenModal());
  }

  handleAssignedEmployeesGridStateChange($event: State) {
    // the filters component mutates the gridState's filters directly so workaround a potential read only error by cloning
    const currentFilter = cloneDeep(this.assignedEmployeesGridState.filter);
    this.assignedEmployeesGridState = cloneDeep($event);
    this.assignedEmployeesGridState.filter = currentFilter;
    this.refreshGrid();
  }

  handleSecurityWarningConfirmed(isConfirmed) {
    if (isConfirmed) {
      this.securityWarningType === FileDownloadSecurityWarningType.TotalRewardsExport ?
        this.store.dispatch(new fromPageActions.ExportAssignedEmployees()) :
        this.store.dispatch(new fromPageActions.GenerateStatements({ method: this.deliveryOption.Method, emailTemplate: this.deliveryOption.EmailTemplate }));
    }
  }

  // filter handler methods
  handleFilterChanged(filters: FilterDescriptor[]) {
    this.isChangingFilters = true;
    this.filterChangeSubject.next(filters);
  }

  handleFiltersClose() {
    this.store.dispatch(new fromPageActions.ToggleGridFilters());
  }

  handleFiltersToggle() {
    this.store.dispatch(new fromPageActions.ToggleGridFilters());
  }

  handleClearFilter(filterDescriptor: FilterDescriptor) {
    this.isChangingFilters = true;
    const remainingFilters = this.assignedEmployeesGridState.filter.filters.filter(f => f.field !== filterDescriptor.field);
    this.filterChangeSubject.next(remainingFilters);
  }

  handleClearAllFilters() {
    this.isChangingFilters = true;
    this.filterChangeSubject.next([]);
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
    if (this.enableFileDownloadSecurityWarning) {
      this.securityWarningType = FileDownloadSecurityWarningType.TotalRewardsExport;
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.store.dispatch(new fromPageActions.ExportAssignedEmployees());
    }
  }

  handleSaveGridColumns(columns: ListAreaColumn[]): void {
    this.store.dispatch(new fromPageActions.SaveGridColumns(columns));
  }

  private refreshGrid() {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.TotalRewardsAssignedEmployees, this.assignedEmployeesGridState));
    this.store.dispatch(new fromAssignedEmployeesGridActions.LoadAssignedEmployees(this.assignedEmployeesGridState));
  }
}
