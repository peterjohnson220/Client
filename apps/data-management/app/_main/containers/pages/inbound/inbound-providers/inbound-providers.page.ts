import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AsyncStateObj, UserContext } from 'libs/models';
import * as fromRootState from 'libs/state/state';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';

import { Provider, TransferMethod } from '../../../../models';
import * as fromDataManagementMainReducer from '../../../../reducers';
import * as fromProviderListActions from '../../../../actions/provider-list.actions';

@Component({
  selector: 'pf-inbound-providers',
  templateUrl: './inbound-providers.page.html',
  styleUrls: ['./inbound-providers.page.scss']
})
export class InboundProvidersPageComponent implements OnInit, OnDestroy {
  selectedProvider: Provider;
  providers: Provider[];

  providers$: Observable<AsyncStateObj<Provider[]>>;
  transferMethods$: Observable<AsyncStateObj<TransferMethod[]>>;
  selectedProvider$: Observable<Provider>;
  identity$: Observable<UserContext>;

  unsubscribe$ = new Subject<void>();
  isDemoCompany = false;

  hrisTestDataBypassFeatureFlag: RealTimeFlag = { key: FeatureFlags.HrisTestDataBypass, value: false };
  constructor(
    private userContextStore: Store<fromRootState.State>,
    private store: Store<fromDataManagementMainReducer.State>,
    private router: Router,
    private featureFlagService: AbstractFeatureFlagService,
  ) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.featureFlagService.bindEnabled(this.hrisTestDataBypassFeatureFlag, this.unsubscribe$);

    this.transferMethods$ = this.store.select(fromDataManagementMainReducer.getTransferMethods);
    this.providers$ = this.store.select(fromDataManagementMainReducer.getProviders);
    this.selectedProvider$ = this.store.select(fromDataManagementMainReducer.getSelectedProvider);

    this.identity$.pipe(takeUntil(this.unsubscribe$), filter(v => !!v)).subscribe(uc => {
      if (uc.CompanyStatus === 'Demo') {
        this.isDemoCompany = true;
      }
    });

    this.providers$.pipe(filter(p => !!p),
      takeUntil(this.unsubscribe$)).subscribe(p => {
        if (this.hrisTestDataBypassFeatureFlag.value) {
          this.providers = p.obj;
        } else {
          this.providers = this.isDemoCompany ? p.obj.filter( v => v.Demo) : p.obj.filter( v => !v.Demo);
        }
      });

    this.selectedProvider$.pipe(filter(sp => !!sp),
      takeUntil(this.unsubscribe$)).subscribe(sp =>
        this.selectedProvider = sp
      );
  }

  ngOnInit() {
    this.store.dispatch(new fromProviderListActions.InitProviderList());
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  cancel() {
    this.router.navigate(['/']);
  }

  setSelectedProvider(provider: Provider) {
    this.store.dispatch(new fromProviderListActions.SetSelectedProvider(provider));
  }

  next() {
    this.router.navigate(['transfer-data/inbound/entity-selection']);
  }

  setSelectedTransferMethod(transferMethodId: number) {
    this.store.dispatch(new fromProviderListActions.SetSelectedTransferMethod(transferMethodId));
  }
}
