import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { StatementModeEnum } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromPageReducer from '../reducers';
import * as fromPageActions from '../actions/statement-view.page.actions';

@Component({
  selector: 'pf-total-rewards-template-view-page',
  templateUrl: './statement-view.page.html',
  styleUrls: ['./statement-view.page.scss']
})
export class StatementViewPageComponent implements OnDestroy, OnInit {
  mode = StatementModeEnum.Preview;
  statement$: Observable<Statement>;
  statementLoading$: Observable<boolean>;
  statementLoadingError$: Observable<boolean>;
  employeeRewardsDataAsync$: Observable<AsyncStateObj<EmployeeRewardsData>>;

  statement: Statement;
  statementId: string;
  employeeId: number;
  employeeRewardsData: EmployeeRewardsData;

  urlParamSubscription = new Subscription();
  statementSubscription = new Subscription();
  employeeRewardsDataSubscription = new Subscription();

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
    this.statementSubscription = this.statement$.subscribe(s => {
      if (s) {
        this.statement = s;
      }
    });
    this.employeeRewardsDataSubscription = this.employeeRewardsDataAsync$.subscribe(e => {
      if (!!e.obj) {
        this.employeeRewardsData = e.obj;
      }
    });

  }

  ngOnDestroy(): void {
    this.urlParamSubscription.unsubscribe();
    this.statementSubscription.unsubscribe();
    this.employeeRewardsDataSubscription.unsubscribe();
  }

  get statementTitle(): string {
    return this.statement.StatementName + ': ' +
      (
        (this.employeeRewardsData.EmployeeFirstName || this.employeeRewardsData.EmployeeLastName) ?
        this.employeeRewardsData.EmployeeFirstName + ' ' + this.employeeRewardsData.EmployeeLastName :
        this.employeeRewardsData.EmployeeId
      );
  }

}
