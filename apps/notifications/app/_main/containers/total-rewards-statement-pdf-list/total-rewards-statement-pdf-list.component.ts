import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromNotificationsMainReducer from '../../reducers';
import * as fromTotalRewardsStatementPdfActions from '../../actions/total-rewards-statement-pdf.actions';
import { TotalRewardsStatementPdf } from '../../models';

@Component({
  selector: 'pf-total-rewards-statement-pdf-list',
  templateUrl: './total-rewards-statement-pdf-list.component.html',
  styleUrls: ['./total-rewards-statement-pdf-list.component.scss']
})
export class TotalRewardsStatementPdfListComponent implements OnInit {
  totalRewardsStatementPdfs$: Observable<AsyncStateObj<TotalRewardsStatementPdf[]>>;

  showAll: boolean;
  displayLimit = 8;

  constructor(private store: Store<fromNotificationsMainReducer.State>) {
    this.totalRewardsStatementPdfs$ = this.store.pipe(select(fromNotificationsMainReducer.getTotalRewardsStatementPdfs));
  }

  ngOnInit() {
    this.store.dispatch(new fromTotalRewardsStatementPdfActions.GetTotalRewardsStatementPdfs());
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

}
