import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { Statement, TotalRewardsControlEnum } from '../../models';
import { select, Store } from '@ngrx/store';
import * as fromTotalRewardsEditReducer from '../../../_main/statement-edit/reducers';
import * as fromEditStatementPageActions from '../../../_main/statement-edit/actions';

@Component({
  selector: 'pf-total-rewards-statement',
  templateUrl: './total-rewards-statement.component.html',
  styleUrls: ['./total-rewards-statement.component.scss']
})
export class TotalRewardsStatementComponent implements OnInit {

  @Input() statementId: number;

  statement$: Observable<Statement>;
  statementLoading$: Observable<boolean>;
  statementLoadingError$: Observable<boolean>;


  controlType = TotalRewardsControlEnum;

  companyColors = [
    '#1f2f3d',
    '#0883be',
    '#ffb300',
    '#dc1e34'
  ];

  employeeData = [
    {
      name: 'Employee 1',
      compensationData: [
        { value: 55, category: 'Base' },
        { value: 10, category: 'Bonus' },
        { value: 20, category: 'Healthcare' },
        { value: 5, category: '401K Match' }
        ],
      logoPath: 'https://images-na.ssl-images-amazon.com/images/I/41yf7iS-BML._SX355_.jpg'
    },
    {
      name: 'Employee 2',
      compensationData: [
        { value: 40, category: 'Base' },
        { value: 20, category: 'Bonus' },
        { value: 20, category: 'Healthcare' },
        { value: 20, category: '401K Match' }
      ],
      logoPath: 'https://vignette.wikia.nocookie.net/theoffice/images/0/02/Michael_Scott.jpg/revision/latest?cb=20170701090332'
    }
  ];

  private pageCountSubscription: Subscription;
  pageCount = 1;
  employeeArray = [];

  constructor(private route: ActivatedRoute,
              private store: Store<fromTotalRewardsEditReducer.State>) { }

  ngOnInit() {
    this.statement$ = this.store.pipe(select(fromTotalRewardsEditReducer.selectStatementState));
    this.statementLoading$ = this.store.pipe(select(fromTotalRewardsEditReducer.selectStatementLoading));
    this.statementLoadingError$ = this.store.pipe(select(fromTotalRewardsEditReducer.selectStatementLoadingError));

    this.pageCountSubscription = this.route.snapshot.queryParams.subscribe(params => {
      // This is for POC employees/pages
      if (params['pages']) {
        this.pageCount = params['pages'];
      }
      for (let i = 0; i < this.pageCount; i++) {
        this.employeeArray.push(this.employeeData[i % 2]);
      }
    });
  }

  getColumnWidth(count) {
    return 'col-' + (12 / count) + ' column';
  }

  getControlWidth(width) {
    return 'col-' + width;
  }

  handleStatementReload() {
    this.store.dispatch(new fromEditStatementPageActions.LoadStatement(this.statementId));
  }
}
