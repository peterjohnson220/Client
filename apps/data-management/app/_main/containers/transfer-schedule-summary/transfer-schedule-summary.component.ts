import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {Observable, Subscription} from 'rxjs';

import {TransferScheduleSummary} from 'libs/models/hris-api/sync-schedule/response';

import * as fromTransferScheduleActions from '../../actions/transfer-schedule.actions';
import * as fromCronHelpers from '../../helpers/cron-helper';
import * as fromDataManagementMainReducer from '../../reducers';
import {GetSupportedSchedulesPipe} from '../../pipes';

@Component({
  selector: 'pf-transfer-schedule-summary',
  templateUrl: './transfer-schedule-summary.component.html',
  styleUrls: ['./transfer-schedule-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferScheduleSummaryComponent implements OnInit, OnDestroy {
  defaultEntities = ['Paymarkets', 'Jobs', 'Structures', 'Structure Mappings', 'Employees'];
  transferScheduleSummary$: Observable<TransferScheduleSummary[]>;
  transferScheduleSummaryLoading$: Observable<boolean>;
  transferScheduleSummaryError$: Observable<boolean>;
  transferScheduleSummary: TransferScheduleSummary[] = [];
  transferScheduleSummarySubscription: Subscription;

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.transferScheduleSummary$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummary);
    this.transferScheduleSummaryLoading$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryLoading);
    this.transferScheduleSummaryError$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummaryError);

    this.transferScheduleSummarySubscription = this.transferScheduleSummary$.subscribe(s => {
      this.transferScheduleSummary = new GetSupportedSchedulesPipe().transform(s);
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromTransferScheduleActions.GetTransferSummary());
  }

  ngOnDestroy() {
    this.transferScheduleSummarySubscription.unsubscribe();
  }

  getSchedule(item: TransferScheduleSummary): string {
    if (item.expression === null) {
      return 'Not Scheduled';
    }
    if (item.active === 0) {
      return 'Disabled';
    }
    if (fromCronHelpers.dailyCronExpression.test(item.expression)) {
      return 'Daily';
    }
    if (fromCronHelpers.weeklyCronExpression.test(item.expression)) {
      return fromCronHelpers.getWeeklyShortSummaryFromExpression(item.expression);
    }
    if (fromCronHelpers.monthlyCronExpression.test(item.expression)) {
      return fromCronHelpers.getMonthlyShortSummaryFromExpression(item.expression);
    }
  }
}
