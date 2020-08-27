import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Store} from '@ngrx/store';

import {Observable, Subject} from 'rxjs';
import {takeUntil, map, filter} from 'rxjs/operators';

import isObject from 'lodash/isObject';
import fill from 'lodash/fill';
import isEmpty from 'lodash/isEmpty';

import {AsyncStateObj} from 'libs/models/state';
import {SyncScheduleDtoModel} from 'libs/models/hris-api/sync-schedule/request';
import {TransferScheduleSummary} from 'libs/models/hris-api/sync-schedule/response';

import * as fromDataManagementMainReducer from '../../../../reducers';
import * as fromTransferScheduleActions from '../../../../actions/transfer-schedule.actions';
import * as fromOutboundJdmActions from '../../../../actions/outbound-jdm.actions';

import {GetSupportedSchedulesPipe} from '../../../../pipes';
import {PayfactorsApiModelMapper} from '../../../../helpers';
import {ConnectionSummary} from '../../../../models';

@Component({
  selector: 'pf-outbound-transfer-schedule-page',
  templateUrl: './outbound-transfer-schedule.page.html',
  styleUrls: ['./outbound-transfer-schedule.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutboundTransferSchedulePageComponent implements OnInit, OnDestroy {
  wasEdited: boolean;
  shouldGoBack: boolean;
  backupExists: boolean;
  editStates: boolean[] = [];
  workflowComplete: boolean;
  backRoute = '/transfer-data/outbound/field-mapping';

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  outboundTransferScheduleSummariesObj$: Observable<AsyncStateObj<TransferScheduleSummary[]>>;
  connectionSummary$: Observable<ConnectionSummary>;
  showIntegrationFinishedModal$: Observable<boolean>;
  transferScheduleSummary: TransferScheduleSummary[];
  syncSchedulesBackup: SyncScheduleDtoModel[] = [];

  constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
    this.outboundTransferScheduleSummariesObj$ = this.store.select(fromDataManagementMainReducer.getOutboundTransferSummaryObj);
    this.outboundTransferScheduleSummariesObj$.pipe(takeUntil(this.unsubscribe$)).subscribe(x => {
      if (!isObject(x) || isEmpty(x.obj)) {
        return;
      }
      this.transferScheduleSummary = new GetSupportedSchedulesPipe().transform(x.obj);
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
    this.connectionSummary$ = this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj).pipe(
      map(summaryObj => summaryObj.obj),
      filter(isObject),
      takeUntil(this.unsubscribe$),
    );
    this.showIntegrationFinishedModal$ = this.store.select(fromDataManagementMainReducer.getShowSetupCompleteModal);
  }

  ngOnInit() {
    this.store.dispatch(new fromOutboundJdmActions.LoadConnectionSummary());
    this.connectionSummary$.subscribe(connectionSummary => {
      this.workflowComplete = connectionSummary.hasConnection;
      if (!connectionSummary.canEditMappings && isEmpty(connectionSummary.selectedEntities)) {
        this.router.navigate(['/']);
      } else {
        this.store.dispatch(new fromTransferScheduleActions.GetOutboundTransferSummary());
        this.backRoute = '/';
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  onCancel() {
    if (this.wasEdited) {
      this.store.dispatch(new fromTransferScheduleActions.SaveAllOutboundTransferSchedules(this.syncSchedulesBackup));
    }
    this.router.navigate(['/']);
  }

  goBack() {
    if (this.wasEdited && !this.workflowComplete) {
      this.shouldGoBack = true;
      this.store.dispatch(new fromTransferScheduleActions.SaveAllOutboundTransferSchedules(this.syncSchedulesBackup));
    }
    this.router.navigate([this.backRoute]);
  }

  canFinish() {
    if (!this.transferScheduleSummary || !this.transferScheduleSummary.length) {
      return false;
    }
    return this.editStates.filter(x => !x).length === this.transferScheduleSummary.length &&
      this.transferScheduleSummary.filter(s => s.syncSchedule_ID > 0).length === this.transferScheduleSummary.length;
  }

  onFinish() {
    this.store.dispatch(new fromTransferScheduleActions.ShowIntegrationSetupCompletedModal(true));
  }

  onOk() {
    this.store.dispatch(new fromOutboundJdmActions.CompleteConnection());
    this.store.dispatch(new fromTransferScheduleActions.ShowIntegrationSetupCompletedModal(false));
    this.router.navigate(['/']);
  }

  updateCanFinish(i: number, $event: boolean) {
    this.wasEdited = this.wasEdited || $event;
    this.editStates[i] = $event;
  }

  disableSchedule($event: number) {
    this.store.dispatch(new fromTransferScheduleActions.DisableOutboundTransferSchedule($event));
  }

  enableSchedule($event: number) {
    this.store.dispatch(new fromTransferScheduleActions.EnableOutboundTransferSchedule($event));
  }

  saveSchedule($event: SyncScheduleDtoModel) {
    this.store.dispatch(new fromTransferScheduleActions.SaveOutboundTransferSchedule($event));
  }
}
