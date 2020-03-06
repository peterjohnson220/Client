import {Component, OnDestroy, OnInit} from '@angular/core';
 import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromTotalRewardsReducer from '../reducers';
import * as fromEditStatementPageActions from '../actions/statement-edit.page.actions';
import { Statement } from '../../../shared/models';


@Component({
  selector: 'pf-statement-edit.page',
  templateUrl: './statement-edit.page.html',
  styleUrls: ['./statement-edit.page.scss']
})
export class StatementEditPageComponent implements OnDestroy, OnInit {
  pageTitle = 'Total Rewards Statements';
  statementNameMaxLength = 100;
  statement$: Observable<Statement>;

  statementIdSubscription: Subscription;
  statementSubscription: Subscription;

  statement: Statement;
  statementId: any;
  statementName: string;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromTotalRewardsReducer.State>
  ) { }

  ngOnInit() {
    this.statement$ = this.store.pipe(select(fromTotalRewardsReducer.selectStatementState));

    this.statementIdSubscription = this.route.params.subscribe(params => {
      if (params['id']) {
        this.statementId = params['id'];
        this.store.dispatch(new fromEditStatementPageActions.LoadStatement(this.statementId));
      }
    });

    this.statementSubscription = this.statement$.subscribe(s => {
        if (s) {
          this.statement = cloneDeep(s);
        }
    });

  }

  ngOnDestroy(): void {
    this.statementIdSubscription.unsubscribe();
    this.statementSubscription.unsubscribe();
  }

  onStatementNameValueChange(value: string): void {
    this.statementName = value;
    const statementObj = this.statement;
    statementObj.Name = value;
    this.store.dispatch(new fromEditStatementPageActions.SaveStatement(statementObj));
  }
}
