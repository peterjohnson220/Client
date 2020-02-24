import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {Observable, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

import {TransferScheduleSummary} from 'libs/models/hris-api/sync-schedule/response';
import {AsyncStateObj} from 'libs/models/state';

import * as fromTransferScheduleActions from '../../actions/transfer-schedule.actions';
import * as fromCronHelpers from '../../helpers/cron-helper';
import * as fromDataManagementMainReducer from '../../reducers';
import {GetSupportedSchedulesPipe} from '../../pipes';

@Component({
  selector: 'pf-outbound-transfer-schedule-summary',
  templateUrl: './outbound-transfer-schedule-summary.component.html',
  styleUrls: ['./outbound-transfer-schedule-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutboundTransferScheduleSummaryComponent implements OnInit, OnDestroy {
  transferScheduleSummary$: Observable<AsyncStateObj<TransferScheduleSummary[]>>;
  transferScheduleSummary: TransferScheduleSummary[] = [];
  transferScheduleSummarySubscription: Subscription;
  hasSummary = false;

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.transferScheduleSummary$ = this.store.select(fromDataManagementMainReducer.getOutboundTransferSummaryObj);

    this.transferScheduleSummarySubscription = this.transferScheduleSummary$.pipe(filter(v => !!v)).subscribe(s => {
      this.transferScheduleSummary = new GetSupportedSchedulesPipe().transform(s.obj);
      this.hasSummary = this.transferScheduleSummary.filter(x => !!x.expression).length > 0;
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromTransferScheduleActions.GetOutboundTransferSummary());
  }

  ngOnDestroy() {
    this.transferScheduleSummarySubscription.unsubscribe();
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
