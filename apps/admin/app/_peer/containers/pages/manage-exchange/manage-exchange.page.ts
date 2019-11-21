import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Exchange } from 'libs/models/peer';
import { GridTypeEnum, StatusEnum } from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromPeerAdminReducer from '../../../reducers';
import * as fromExchangeActions from '../../../actions/exchange.actions';
import { GridHelperService } from '../../../services';

@Component({
  selector: 'pf-manage-exchange-page',
  templateUrl: './manage-exchange.page.html',
  styleUrls: ['./manage-exchange.page.scss']
})
export class ManageExchangePageComponent implements OnInit, OnDestroy {
  exchange$: Observable<Exchange>;
  totalExchangeCompanies$: Observable<number>;
  totalExchangeJobs$: Observable<number>;
  totalExchangeAccessRequests$: Observable<number>;
  totalPayfactorsCompanyExchangeInvitations$: Observable<number>;
  totalNewCompanyExchangeInvitations$: Observable<number>;
  totalExchangeJobRequests$: Observable<number>;
  totalExchangeFilters$: Observable<number>;
  isExchangeActive$: Observable<boolean>;
  canToggleExchangeStatus$: Observable<boolean>;
  isValidExchange$: Observable<boolean>;
  loadingExchange$: Observable<boolean>;

  isValidExchangeSubcription: Subscription;

  exchangeId: number;
  navLinks: any[];

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
    this.isExchangeActive$ = this.exchange$.pipe(map(e => e.Status === StatusEnum.Active));
    this.canToggleExchangeStatus$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchangeCanToggleExchangeStatus));
    this.isValidExchange$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchangeIsValidExchange));
    this.loadingExchange$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchangeLoading));
  }

  handleSwitchToggled() {
    this.store.dispatch(new fromExchangeActions.OpenToggleExchangeStatusModal());
  }

  ngOnInit() {
    this.isValidExchangeSubcription = this.isValidExchange$.subscribe(isValidExchange => {
      let isExchangeActive = false;
      this.isExchangeActive$.pipe(take(1)).subscribe(x => {
        isExchangeActive = x;
      });

      if (!isValidExchange && isExchangeActive) {
        this.store.dispatch(new fromExchangeActions.UpdateExchangeStatus(this.exchangeId, StatusEnum.Inactive));
      }
    });

    this.gridHelperService.loadExchangeJobs(this.exchangeId);
    this.gridHelperService.loadExchangeCompanies(this.exchangeId);
    this.gridHelperService.loadExchangeAccessRequests(this.exchangeId);
    this.gridHelperService.loadPayfactorsCompanyExchangeInvitations(this.exchangeId);
    this.gridHelperService.loadNewCompanyExchangeInvitations(this.exchangeId);
    this.gridHelperService.loadExchangeJobRequests(this.exchangeId);
    this.gridHelperService.loadExchangeFilters(this.exchangeId, '');

    this.navLinks = [
      { name: 'Companies', route: 'companies', icon: 'building', count$: this.totalExchangeCompanies$ },
      { name: 'Jobs', route: 'jobs', icon: 'briefcase', count$: this.totalExchangeJobs$ },
      { name: 'Access Requests', route: 'accessrequests', icon: 'unlock-alt', count$: this.totalExchangeAccessRequests$ },
      { name: 'Company Invitations', route: 'companyinvitations', icon: 'envelope', count$: this.totalPayfactorsCompanyExchangeInvitations$ },
      { name: 'Company Referrals', route: 'companyreferrals', icon: 'address-card', count$: this.totalNewCompanyExchangeInvitations$ },
      { name: 'Job Requests', route: 'jobrequests', icon: 'tasks', count$: this.totalExchangeJobRequests$ },
      { name: 'Exchange Filters', route: 'exchangefilters', icon: 'filter', count$: this.totalExchangeFilters$ }
    ];
  }

  ngOnDestroy() {
    this.isValidExchangeSubcription.unsubscribe();

    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeCompanies));
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobs));
  }
}
