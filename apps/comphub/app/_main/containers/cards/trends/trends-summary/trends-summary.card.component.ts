import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models/state';
import { PayRateDate } from 'libs/models/payfactors-api/peer/exchange-data-search/response';

import { ComphubPages } from '../../../../data';
import { JobSalaryTrend, WorkflowContext } from '../../../../models';
import * as fromComphubMainReducer from '../../../../reducers';
import * as fromTrendsSummaryCardActions from '../../../../actions/trends-summary-card.actions';

@Component ({
  selector: 'pf-trends-summary-card',
  templateUrl: './trends-summary.card.component.html',
  styleUrls: ['./trends-summary.card.component.scss']
})
export class TrendsSummaryCardComponent implements OnInit, OnDestroy {

  workflowContext: WorkflowContext;
  workflowContext$: Observable<WorkflowContext>;
  workflowContextSubscription: Subscription;

  peerTrends: PayRateDate[];
  peerTrends$: Observable<AsyncStateObj<PayRateDate[]>>;
  peerTrendsSubscription: Subscription;

  jobSalaryTrend: JobSalaryTrend;

  comphubPages = ComphubPages;

  constructor(
    private store: Store<fromComphubMainReducer.State>) {
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.peerTrends$ = this.store.select(fromComphubMainReducer.getPeerTrends);
  }

  ngOnInit(): void {

    this.workflowContextSubscription = this.workflowContext$.subscribe( wfc => {
      if (!!wfc && wfc.selectedPageId === ComphubPages.TrendsSummary) {
        this.workflowContext = wfc;
        this.getPeerTrends();
      }
    });

    this.peerTrendsSubscription = this.peerTrends$.subscribe(pt => {
      if ( !!pt.obj ) {
        if (pt.obj.length > 0) {
          this.peerTrends = pt.obj;
          this.jobSalaryTrend = {
            PercentageChange: ((this.peerTrends[this.peerTrends.length - 1].BasePay / this.peerTrends[0].BasePay) - 1) * 100,
            Data: this.peerTrends.map(x =>
              ({
                SalaryAnnual: x.BasePay,
                SalaryHourly: x.BasePay / 2080,
                EffectiveDate: x.EffectiveDate
              })
            )
          };
        } else {
          this.peerTrends = pt.obj;
          this.jobSalaryTrend = {
            PercentageChange: 0,
            Data: []
          };
        }

      }
    });

  }

  ngOnDestroy(): void {
    this.workflowContextSubscription.unsubscribe();
  }

  private getPeerTrends() {
    this.store.dispatch(new fromTrendsSummaryCardActions.GetPeerTrends());
  }
}
