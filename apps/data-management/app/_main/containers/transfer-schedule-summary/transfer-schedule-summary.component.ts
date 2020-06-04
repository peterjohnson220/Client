import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TransferScheduleSummary } from 'libs/models/hris-api/sync-schedule/response';

import * as fromCronHelpers from '../../helpers/cron-helper';
import * as fromDataManagementMainReducer from '../../reducers';

@Component({
  selector: 'pf-transfer-schedule-summary',
  templateUrl: './transfer-schedule-summary.component.html',
  styleUrls: ['./transfer-schedule-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferScheduleSummaryComponent {
  transferScheduleSummary$: Observable<TransferScheduleSummary[]>;

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.transferScheduleSummary$ = this.store.select(fromDataManagementMainReducer.getTransferScheduleSummary);
  }

  getSchedule(item: TransferScheduleSummary): string {
    if (item.expression === null) {
      return 'not scheduled';
    }
    if (item.active === 0) {
      return 'disabled';
    }
    if (fromCronHelpers.dailyCronExpression.test(item.expression)) {
      return 'daily';
    }
    if (fromCronHelpers.weeklyCronExpression.test(item.expression)) {
      return 'every ' + fromCronHelpers.getWeeklyShortSummaryFromExpression(item.expression);
    }
    if (fromCronHelpers.monthlyCronExpression.test(item.expression)) {
      return fromCronHelpers.getMonthlyShortSummaryFromExpression(item.expression) + ' of every month';
    }
    if (fromCronHelpers.uponPublishCronExpression.test(item.expression)) {
      return 'upon publish';
    }
  }
}
