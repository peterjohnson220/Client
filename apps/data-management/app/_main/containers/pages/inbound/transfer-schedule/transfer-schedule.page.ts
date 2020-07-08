import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { fill, isEmpty } from 'lodash';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, skip } from 'rxjs/operators';

import { CompositeDataLoadTypes, LoadTypes } from 'libs/constants';
import * as fromEmailRecipientsActions from 'libs/features/loader-email-reipients/state/actions/email-recipients.actions';
import { EmailRecipientModel, SyncScheduleDtoModel, TransferScheduleSummary, UserContext } from 'libs/models';
import * as fromRootState from 'libs/state/state';

import { PayfactorsApiModelMapper } from '../../../../helpers';
import * as fromHrisConnectionActions from '../../../../actions/hris-connection.actions';
import * as fromOnDemandSyncActions from '../../../../actions/on-demand-sync.actions';
import * as fromTransferScheduleActions from '../../../../actions/transfer-schedule.actions';
import { GetSupportedSchedulesPipe } from '../../../../pipes';
import * as fromDataManagementMainReducer from '../../../../reducers';

@Component({
  selector: 'pf-transfer-schedule',
  templateUrl: './transfer-schedule.page.html',
  styleUrls: ['./transfer-schedule.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferSchedulePageComponent implements OnInit, OnDestroy {
  transferScheduleSummary$: Observable<TransferScheduleSummary[]>;
  transferScheduleSummaryLoading$: Observable<boolean>;
  transferScheduleSummarySaving$: Observable<boolean>;
  transferScheduleSummaryError$: Observable<boolean>;
  emailRecipientsSavingError$: Observable<boolean>;
  emailRecipientsRemovingError$: Observable<boolean>;
  emailRecipientsModalOpen$: Observable<boolean>;
  emailRecipients$: Observable<EmailRecipientModel[]>;
  identity$: Observable<UserContext>;
  connectionSaving$: Observable<boolean>;
  transferScheduleSummarySubscription: Subscription;
  restoreCompletedSubscription: Subscription;
  connectionSummarySub: Subscription;
  identitySubscription: Subscription;

  transferScheduleSummary: TransferScheduleSummary[] = [];
  syncSchedulesBackup: SyncScheduleDtoModel[] = [];
  backupExists: boolean;
  editStates: boolean[] = [];
  wasEdited: boolean;
  shouldGoBack: boolean;
  workflowComplete: boolean;
  validationMode = true;
  backRoute = '/transfer-data/inbound/field-mapping';
  companyId: number;
  loaderConfigurationGroupId: number;
  loadType = LoadTypes.Hris;
  primaryCompositeDataLoadType = CompositeDataLoadTypes.OrgData;

  showIntegrationFinishedModal$: Observable<boolean>;

  constructor(private userContextStore: Store<fromRootState.State>, private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
    this.transferScheduleSummary$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummary);
    this.transferScheduleSummaryLoading$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryLoading);
    this.transferScheduleSummarySaving$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummarySaving);
    this.transferScheduleSummaryError$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryError);
    this.connectionSaving$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoading);
    this.emailRecipientsSavingError$ = this.store.select(fromDataManagementMainReducer.getSavingRecipientError);
    this.emailRecipientsRemovingError$ = this.store.select(fromDataManagementMainReducer.getRemovingRecipientError);
    this.emailRecipientsModalOpen$ = this.store.select(fromDataManagementMainReducer.getEmailRecipientsModalOpen);
    this.emailRecipients$ = this.store.select(fromDataManagementMainReducer.getEmailRecipients);
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.transferScheduleSummarySubscription = this.transferScheduleSummary$.pipe(skip(1)).subscribe(s => {
      this.transferScheduleSummary = new GetSupportedSchedulesPipe().transform(s);
      if (!this.wasEdited && !this.backupExists) {
        this.syncSchedulesBackup = PayfactorsApiModelMapper
          .mapTransferScheduleSummariesToSyncScheduleDto(this.transferScheduleSummary)
          // Null expressions are not a backup.  It indicates that a schedule has never been set
          .filter(d => d.Expression !== null);
        this.backupExists = true;
      }
      if (this.transferScheduleSummary.length) {
        this.editStates = fill(Array(this.transferScheduleSummary.length), false);
      }
    });
    this.restoreCompletedSubscription = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryRestoreCompleted)
      .pipe(filter(x => x === true)).subscribe(s => {
        if (this.shouldGoBack) {
          this.router.navigate(['/transfer-data/inbound/field-mapping']);
        }
      });
    this.identitySubscription = this.identity$.subscribe(i => {
      if (!!i) {
        this.companyId = i.CompanyId;
      }
    });
    this.connectionSummarySub = this.store.select(fromDataManagementMainReducer.getHrisConnectionSummary)
      .pipe(filter((v) => !!v)).subscribe((connectionSummary) => {
        this.workflowComplete = connectionSummary.hasConnection;
        this.validationMode = connectionSummary.validationMode;
        if (connectionSummary.hasConnection) {
          this.backRoute = '/';
        }
        if (connectionSummary.loaderConfigurationGroupId) {
          this.loaderConfigurationGroupId = connectionSummary.loaderConfigurationGroupId;
          this.store.dispatch(new fromEmailRecipientsActions.LoadEmailRecipients({
            companyId: this.companyId,
            loaderConfigurationGroupId: connectionSummary.loaderConfigurationGroupId,
            loaderType: CompositeDataLoadTypes.OrgData,
          }));
        }
      });
    this.showIntegrationFinishedModal$ = this.store.select(fromDataManagementMainReducer.getShowSetupCompleteModal);
  }

  ngOnInit() {
    this.store.dispatch(new fromHrisConnectionActions.GetHrisConnectionSummary());
    this.store.dispatch(new fromTransferScheduleActions.GetTransferSummary());
  }

  ngOnDestroy() {
    this.transferScheduleSummarySubscription.unsubscribe();
    this.restoreCompletedSubscription.unsubscribe();
    this.connectionSummarySub.unsubscribe();
    this.identitySubscription.unsubscribe();
  }

  onCancel() {
    if (this.wasEdited) {
      this.store.dispatch(new fromTransferScheduleActions.SaveAllTransferSchedules({schedules: this.syncSchedulesBackup, route: '/'}));
    } else {
      this.router.navigate(['/']);
    }
  }

  goBack() {
    if (this.wasEdited && !this.workflowComplete) {
      this.shouldGoBack = true;
      this.store.dispatch(new fromTransferScheduleActions.SaveAllTransferSchedules({
        schedules: this.syncSchedulesBackup,
        route: this.backRoute
      }));
    } else {
      this.router.navigate([this.backRoute]);
    }
  }

  onEmailRecipients() {
    this.store.dispatch(new fromEmailRecipientsActions.OpenEmailRecipientsModal());
  }

  onFinish() {
    if (this.validationMode) {
      this.queueValidationSync();
    }

    this.store.dispatch(new fromTransferScheduleActions.ShowIntegrationSetupCompletedModal(true));
  }

  onOk() {
    this.store.dispatch(new fromTransferScheduleActions.ShowIntegrationSetupCompletedModal(false));
    this.router.navigate(['/']);
  }

  canFinish(): boolean {
    return this.validationMode || (
      !isEmpty(this.transferScheduleSummary) &&
      this.editStates.every(x => !x) &&
      this.transferScheduleSummary.every(s => s.syncSchedule_ID > 0)
    );
  }

  updateCanFinish(i: number, $event: boolean) {
    this.wasEdited = this.wasEdited || $event;
    this.editStates[i] = $event;
  }

  disableSchedule($event: number) {
    this.store.dispatch(new fromTransferScheduleActions.DisableTransferSchedule($event));
  }

  enableSchedule($event: number) {
    this.store.dispatch(new fromTransferScheduleActions.EnableTransferSchedule($event));
  }

  saveSchedule($event: SyncScheduleDtoModel) {
    this.store.dispatch(new fromTransferScheduleActions.SaveTransferSchedule($event));
  }

  handleValidationModeChanged() {
    this.validationMode = !this.validationMode;
    this.store.dispatch(new fromHrisConnectionActions.ToggleValidationMode(this.validationMode));
  }

  queueValidationSync() {
    this.store.dispatch(new fromOnDemandSyncActions.QueueOnDemandSync());
  }
}
