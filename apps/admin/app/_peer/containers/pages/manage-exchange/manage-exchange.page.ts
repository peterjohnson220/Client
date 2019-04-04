import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
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
  totalExchangeAccessRequests$: Observable<number>;
  totalPayfactorsCompanyExchangeInvitations$: Observable<number>;
  totalNewCompanyExchangeInvitations$: Observable<number>;
  totalExchangeJobRequests$: Observable<number>;
  totalExchangeFilters$: Observable<number>;

  constructor(private store: Store<fromPeerAdminReducer.State>,
              private activeRoute: ActivatedRoute,
              private gridHelperService: GridHelperService) {
    this.exchange$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchange));
    this.exchangeId = activeRoute.snapshot.params.id;
    this.totalExchangeCompanies$ = this.store.pipe(select(fromPeerAdminReducer.getTotalExchangeCompanies));
    this.totalExchangeJobs$ = this.store.pipe(select(fromPeerAdminReducer.getTotalExchangeJobs));
    this.totalExchangeAccessRequests$ = this.store.pipe(select(fromPeerAdminReducer.getTotalExchangeAccessRequests));
    this.totalPayfactorsCompanyExchangeInvitations$ =
      this.store.pipe(select(fromPeerAdminReducer.getTotalPayfactorsCompanyExchangeInvitations));
    this.totalNewCompanyExchangeInvitations$ = this.store.pipe(select(fromPeerAdminReducer.getTotalNewCompanyExchangeInvitations));
    this.totalExchangeJobRequests$ = this.store.pipe(select(fromPeerAdminReducer.getTotalExchangeJobRequests));
    this.totalExchangeFilters$ = this.store.pipe(select(fromPeerAdminReducer.getTotalExchangeFilters));
  }

  ngOnInit() {
    this.gridHelperService.loadExchangeJobs(this.exchangeId);
    this.gridHelperService.loadExchangeCompanies(this.exchangeId);
    this.gridHelperService.loadExchangeAccessRequests(this.exchangeId);
    this.gridHelperService.loadPayfactorsCompanyExchangeInvitations(this.exchangeId);
    this.gridHelperService.loadNewCompanyExchangeInvitations(this.exchangeId);
    this.gridHelperService.loadExchangeJobRequests(this.exchangeId);
    this.gridHelperService.loadExchangeFilters(this.exchangeId, '');
  }

  ngOnDestroy() {
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeCompanies));
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobs));
  }
}
