import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';

import * as fromPageReducer from '../reducers';
import * as fromPageActions from '../actions/statement-history.page.actions';

@Component({
  selector: 'pf-statement-history.page',
  templateUrl: './statement-history.page.html',
  styleUrls: ['./statement-history.page.scss']
})
export class StatementHistoryPageComponent implements OnInit, OnDestroy {
  statement$: Observable<Statement>;

  routeParamSubscription = new Subscription();

  totalRewardsHistoryFeatureFlag: RealTimeFlag = { key: FeatureFlags.TotalRewardsHistory, value: false };
  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<fromPageReducer.State>,
    private route: ActivatedRoute, private router: Router,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.featureFlagService.bindEnabled(this.totalRewardsHistoryFeatureFlag, this.unsubscribe$);
  }

  ngOnInit(): void {
    if (!this.totalRewardsHistoryFeatureFlag.value) {
      this.router.navigate(['not-found']);
    }
    this.statement$ = this.store.pipe(select(fromPageReducer.getStatement));

    this.routeParamSubscription = this.route.params.subscribe(params => {
      this.store.dispatch(new fromPageActions.LoadStatement({ statementId: params['id'] }));
    });
  }

  ngOnDestroy() {
    this.routeParamSubscription.unsubscribe();
    this.unsubscribe$.next();
  }
}
