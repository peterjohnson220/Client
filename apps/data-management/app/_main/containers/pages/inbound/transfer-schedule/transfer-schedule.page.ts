import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, skip } from 'rxjs/operators';

import { fill } from 'lodash';

import { SyncScheduleDtoModel, TransferScheduleSummary } from 'libs/models/hris-api/sync-schedule';

import { PayfactorsApiModelMapper } from '../../../../helpers';
import * as fromHrisConnectionActions from '../../../../actions/hris-connection.actions';
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
  transferScheduleSummarySubscription: Subscription;
  restoreCompletedSubscription: Subscription;
  connectionSummarySub: Subscription;

  transferScheduleSummary: TransferScheduleSummary[] = [];
  syncSchedulesBackup: SyncScheduleDtoModel[] = [];
  backupExists: boolean;
  editStates: boolean[] = [];
  wasEdited: boolean;
  shouldGoBack: boolean;
  workflowComplete: boolean;
  backRoute = '/transfer-data/inbound/field-mapping';

  showIntegrationFinishedModal$: Observable<boolean>;

  constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
    this.transferScheduleSummary$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummary);
    this.transferScheduleSummaryLoading$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryLoading);
    this.transferScheduleSummarySaving$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummarySaving);
    this.transferScheduleSummaryError$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryError);
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
    this.connectionSummarySub = this.store.select(fromDataManagementMainReducer.getHrisConnectionSummary)
      .pipe(filter((v) => !!v)).subscribe((connectionSummary) => {
        this.workflowComplete = connectionSummary.hasConnection;
        if (connectionSummary.hasConnection) {
          this.backRoute = '/';
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

  onFinish() {
    this.store.dispatch(new fromTransferScheduleActions.ShowIntegrationSetupCompletedModal(true));
  }

  onOk() {
    this.store.dispatch(new fromTransferScheduleActions.ShowIntegrationSetupCompletedModal(false));
    this.router.navigate(['/']);
  }

  canFinish(): boolean {
    if (!this.transferScheduleSummary || !this.transferScheduleSummary.length) {
      return false;
    }
    return this.editStates.filter(x => !x).length === this.transferScheduleSummary.length &&
           this.transferScheduleSummary.filter(s => s.syncSchedule_ID > 0).length === this.transferScheduleSummary.length;
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
}