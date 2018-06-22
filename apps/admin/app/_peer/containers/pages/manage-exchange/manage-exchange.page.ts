import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Exchange } from 'libs/models/peer';
import { GridTypeEnum } from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromPeerAdminReducer from '../../../reducers';
import { GridHelperService } from '../../../services';

@Component({
  selector: 'pf-manage-exchange-page',
  templateUrl: './manage-exchange.page.html',
  styleUrls: ['./manage-exchange.page.scss']
})
export class ManageExchangePageComponent implements OnInit, OnDestroy {
  exchange$: Observable<Exchange>;
  exchangeId: number;
  totalExchangeCompanies$: Observable<number>;
  totalExchangeJobs$: Observable<number>;
  totalPendingExchangeAccessRequests$: Observable<number>;

  constructor(private store: Store<fromPeerAdminReducer.State>,
              private activeRoute: ActivatedRoute,
              private gridHelperService: GridHelperService) {
    this.exchange$ = this.store.select(fromPeerAdminReducer.getManageExchange);
    this.exchangeId = activeRoute.snapshot.params.id;
    this.totalExchangeCompanies$ = this.store.select(fromPeerAdminReducer.getTotalExchangeCompanies);
    this.totalExchangeJobs$ = this.store.select(fromPeerAdminReducer.getTotalExchangeJobs);
    this.totalPendingExchangeAccessRequests$ = this.store.select(fromPeerAdminReducer.getTotalPendingExchangeAccessRequests);
  }

  ngOnInit() {
    this.gridHelperService.loadExchangeJobs(this.exchangeId);
    this.gridHelperService.loadExchangeCompanies(this.exchangeId);
    this.gridHelperService.loadPendingExchangeAccessRequests(this.exchangeId);
  }

  ngOnDestroy() {
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeCompanies));
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobs));
  }
}
