import { Component, OnInit } from '@angular/core';

import { Observable,  } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import { UserContext } from 'libs/models/security';
import * as fromRootReducer from 'libs/state/state';
import { SystemUserGroupNames } from 'libs/constants';
import { AsyncStateObj } from 'libs/models/state';

import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubSharedReducer from '../../../reducers';
import { ComphubPages } from '../../../data';
import { JobPricingLimitInfo } from '../../../models/job-pricing-limit-info.model';
import { QuickPriceHistoryContext } from '../../../models';

@Component({
  selector: 'pf-jobs-card-wrapper',
  templateUrl: './jobs-card-wrapper.component.html',
  styleUrls: ['./jobs-card-wrapper.component.scss']
})
export class JobsCardWrapperComponent implements OnInit {
  pricedJobsCount$: Observable<AsyncStateObj<number>>;
  jobPricingBlocked$: Observable<boolean>;
  countryDataSetsLoaded$: Observable<boolean>;
  userContext$: Observable<UserContext>;
  jobPricingLimitInfo$: Observable<JobPricingLimitInfo>;

  comphubPages = ComphubPages;
  systemUserGroupNames = SystemUserGroupNames;

  constructor(
    private store: Store<fromComphubSharedReducer.State>,
    private basicGridStore: Store<fromBasicDataGridReducer.State>
  ) {
    this.jobPricingBlocked$ = this.store.select(fromComphubSharedReducer.getJobPricingBlocked);
    this.jobPricingLimitInfo$ = this.store.select(fromComphubSharedReducer.getJobPricingLimitInfo);
    this.countryDataSetsLoaded$ = this.store.select(fromComphubSharedReducer.getCountryDataSetsLoaded);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
  }

  openQuickPriceHistoryModal(): void {
    this.store.dispatch(new fromComphubPageActions.SetQuickPriceHistoryModalOpen(true));
  }

  ngOnInit(): void {
    this.pricedJobsCount$ = this.basicGridStore.select(fromBasicDataGridReducer.getTotalCount, QuickPriceHistoryContext.gridId);
  }

}
