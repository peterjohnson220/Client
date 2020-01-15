import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {Observable, Subscription} from 'rxjs';
import { fill, cloneDeep } from 'lodash';
import {TransferScheduleSummary} from 'libs/models/hris-api/sync-schedule/response';

import * as fromTransferScheduleActions from '../../../actions/transfer-schedule.actions';
import * as fromDataManagementMainReducer from '../../../reducers';
import {GetSupportedSchedulesPipe} from '../../../pipes';

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
  transferScheduleSummary: TransferScheduleSummary[] = [];
  transferScheduleSummaryBackup: TransferScheduleSummary[] = [];

  editStates: boolean[] = [];
  transferScheduleSummarySubscription: Subscription;

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.transferScheduleSummary$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummary);
    this.transferScheduleSummaryLoading$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryLoading);
    this.transferScheduleSummarySaving$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummarySaving);
    this.transferScheduleSummaryError$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryError);
    this.transferScheduleSummarySubscription = this.transferScheduleSummary$.subscribe(s => {
      this.transferScheduleSummary = new GetSupportedSchedulesPipe().transform(s);
      this.transferScheduleSummaryBackup = cloneDeep(this.transferScheduleSummary);
      if (this.transferScheduleSummary.length) {
        this.editStates = fill(Array(this.transferScheduleSummary.length), false);
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromTransferScheduleActions.GetTransferSummary());
  }

  ngOnDestroy() {
    this.transferScheduleSummarySubscription.unsubscribe();
  }

  onCancel() {

  }

  goBack() {

  }

  onFinish() {

  }

  canFinish(): boolean {
    if (!this.transferScheduleSummary || !this.transferScheduleSummary.length) {
      return false;
    }
    return this.editStates.filter(x => !x).length === this.transferScheduleSummary.length &&
           this.transferScheduleSummary.filter(s => s.syncSchedule_ID > 0).length === this.transferScheduleSummary.length;
  }

  updateCanFinish(i: number, $event: boolean) {
    this.editStates[i] = $event;
  }
}
