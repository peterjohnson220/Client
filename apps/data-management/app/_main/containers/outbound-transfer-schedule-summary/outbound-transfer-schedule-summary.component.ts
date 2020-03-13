import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {isObject, isEmpty} from 'lodash';
import {Observable, Subscription} from 'rxjs';

import {TransferScheduleSummary} from 'libs/models/hris-api/sync-schedule/response';
import {AsyncStateObj} from 'libs/models/state';

import * as fromTransferScheduleActions from '../../actions/transfer-schedule.actions';
import * as fromCronHelpers from '../../helpers/cron-helper';
import * as fromDataManagementMainReducer from '../../reducers';
import {GetSupportedSchedulesPipe} from '../../pipes';
import {JdmView} from '../../models';

@Component({
  selector: 'pf-outbound-transfer-schedule-summary',
  templateUrl: './outbound-transfer-schedule-summary.component.html',
  styleUrls: ['./outbound-transfer-schedule-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutboundTransferScheduleSummaryComponent implements OnInit, OnDestroy {
  summaryObj$: Observable<{ summary: AsyncStateObj<TransferScheduleSummary[]>, views: AsyncStateObj<JdmView[]> }>;

  transferScheduleSummary: TransferScheduleSummary[] = [];
  jdmViews: JdmView[] = [];
  summaryObjSubscription: Subscription;
  hasSummary = false;

  constructor(private store: Store<fromDataManagementMainReducer.State>) {
    this.summaryObj$ = this.store.select(fromDataManagementMainReducer.getOutboundTransferSummaryWidget);
    this.summaryObjSubscription = this.summaryObj$.subscribe(s => {
      if (isObject(s.summary)) {
        this.transferScheduleSummary = new GetSupportedSchedulesPipe().transform(s.summary.obj);
      }
      if (isObject(s.views)) {
        this.jdmViews = s.views.obj.filter(x => x.isChecked);
      }
      this.hasSummary = this.transferScheduleSummary.filter(x => !!x.expression).length > 0 && !isEmpty(this.jdmViews);
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromTransferScheduleActions.GetOutboundTransferSummary());
  }

  ngOnDestroy() {
    this.summaryObjSubscription.unsubscribe();
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
