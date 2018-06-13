import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Exchange } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../../reducers';
import { GridHelperService } from '../../../services';

@Component({
  selector: 'pf-manage-exchange-page',
  templateUrl: './manage-exchange.page.html',
  styleUrls: ['./manage-exchange.page.scss']
})
export class ManageExchangePageComponent implements OnInit {
  exchange$: Observable<Exchange>;
  exchangeId: number;
  totalExchangeCompanies$: Observable<number>;
  totalExchangeJobs$: Observable<number>;

  constructor(private store: Store<fromPeerAdminReducer.State>,
              private activeRoute: ActivatedRoute,
              private gridHelperService: GridHelperService) {
    this.exchange$ = this.store.select(fromPeerAdminReducer.getManageExchange);
    this.exchangeId = activeRoute.snapshot.params.id;
    this.totalExchangeCompanies$ = this.store.select(fromPeerAdminReducer.getTotalExchangeCompanies);
    this.totalExchangeJobs$ = this.store.select(fromPeerAdminReducer.getTotalExchangeJobs);
  }

  ngOnInit() {
    this.gridHelperService.loadExchangeJobs(this.exchangeId);
    this.gridHelperService.loadExchangeCompanies(this.exchangeId);
  }
}
