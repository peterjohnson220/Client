import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { StatementModeEnum, StatementForPrint } from '../../../shared/models';
import * as fromReducers from '../reducers';
import * as fromPageActions from '../actions/statement-print.page.actions';

@Component({
  selector: 'pf-total-rewards-template-print-page',
  templateUrl: './statement-print.page.html',
  styleUrls: ['./statement-print.page.scss']
})
export class StatementPrintPageComponent implements OnDestroy, OnInit {
  printMode = StatementModeEnum.Print;
  statement$: Observable<StatementForPrint>;

  urlParamSubscription = new Subscription();

  constructor(
    private store: Store<fromReducers.State>,
    private route: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.urlParamSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.urlParamSubscription = this.route.params.subscribe(params => {
      const pdfId = params['pdfId'];
      this.store.dispatch(new fromPageActions.LoadStatement(pdfId));
    });
    this.statement$ = this.store.pipe(select(fromReducers.selectStatement));
  }
}
