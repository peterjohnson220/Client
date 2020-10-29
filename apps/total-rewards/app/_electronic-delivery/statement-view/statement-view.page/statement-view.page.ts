import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromPageReducer from '../reducers';
import * as fromPageActions from '../actions/statement-view.page.actions';

@Component({
  selector: 'pf-total-rewards-template-view-page',
  templateUrl: './statement-view.page.html',
  styleUrls: ['./statement-view.page.scss']
})
export class StatementViewPageComponent implements OnDestroy, OnInit {
  statement$: Observable<Statement>;
  statementLoading$: Observable<boolean>;
  statementLoadingError$: Observable<boolean>;
  employeeRewardsDataAsync$: Observable<AsyncStateObj<EmployeeRewardsData>>;

  statement: Statement;
  statementId: string;
  employeeId: number;
  employeeRewardsData: EmployeeRewardsData;

  urlParamSubscription = new Subscription();

  constructor(private store: Store<fromPageReducer.State>, private route: ActivatedRoute) { }

  ngOnInit() {

    this.statement$ = this.store.pipe(select(fromPageReducer.selectStatement));
    this.statementLoading$ = this.store.pipe(select(fromPageReducer.selectStatementLoading));
    this.statementLoadingError$ =  this.store.pipe(select(fromPageReducer.selectStatementLoadingError));
    this.employeeRewardsDataAsync$ = this.store.pipe(select(fromPageReducer.getEmployeeRewardsData));

    this.urlParamSubscription = this.route.params.subscribe(params => {
      this.statementId = params['statement_id'];
      this.employeeId = params['employee_id'];

      this.store.dispatch(new fromPageActions.GetEmployeeRewardsData({ companyEmployeeId: this.employeeId }));
      this.store.dispatch(new fromPageActions.LoadStatement(this.statementId));
    });
  }

  ngOnDestroy(): void {
    this.urlParamSubscription.unsubscribe();
  }

}
