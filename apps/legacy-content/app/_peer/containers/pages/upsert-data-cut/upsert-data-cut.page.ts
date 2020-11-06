import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromSurveySearchResultsActions from 'libs/features/survey-search/actions/survey-search-results.actions';
import * as fromLibsExchangeExplorerActions from 'libs/features/peer/exchange-explorer/actions/exchange-explorer.actions';
import * as fromUpsertDataCutActions from 'libs/features/upsert-peer-data-cut/actions/upsert-peer-data-cut.actions';
import * as fromUpsertPeerDataReducer from 'libs/features/upsert-peer-data-cut/reducers';
import {UpsertPeerDataCutEntityConfigurationModel} from 'libs/features/upsert-peer-data-cut/models';
import {
  UpsertPeerDataCutEntities,
  UpsertPeerDataCutParentEntities
} from 'libs/features/upsert-peer-data-cut/constants/upsert-peer-data-cut-entities.constants';

@Component({
  selector: 'pf-upsert-data-cut-page',
  templateUrl: './upsert-data-cut.page.html'
})

export class UpsertDataCutPageComponent implements OnInit {
  companyJobId: number;
  companyPayMarketId: number;
  userSessionId: number;
  isPayMarketOverride: boolean;
  cutGuid: string;
  userJobMatchId: number;

  upsertEntityConfiguration: UpsertPeerDataCutEntityConfigurationModel = {
    BaseEntity: UpsertPeerDataCutEntities.ProjectJobs,
    ParentEntity: UpsertPeerDataCutParentEntities.Projects,
    BaseEntityId: undefined,
    ParentEntityId: undefined
  };

  constructor(private store: Store<fromUpsertPeerDataReducer.State>, private route: ActivatedRoute) {}

  ngOnInit() {
    this.setQueryParamMembers();
  }

  // Add Data cut page within marketdata.asp specific code
  @HostListener('window:message', ['$event'])
  onMessage(ev) {
    if (this.inIframe() && ev.data === 'peer-exchange-tab-clicked') {
      // Hack. Wait a little before telling the client app that page is now in view in
      // an IFrame. Need to do this to allow the css positioning of the map to finish on the ASP side
      // before passing off the bounds to the map to initialize zooming. Otherwise we will run into the "Zoom Bug"
      // where the map does not zoom all the way in.
      window.setTimeout(() => {
        this.store.dispatch(new fromUpsertDataCutActions.PageInViewInIframe());
      }, 100);

      return;
    }

    if (ev.data && ev.data.type === fromSurveySearchResultsActions.REFINE_EXCHANGE_JOB_RESULT && !!ev.data.body) {
      this.store.dispatch(new fromLibsExchangeExplorerActions.RefineExchangeJob({...ev.data.body, companyPayMarketId: this.companyPayMarketId}));
      return;
    }

    if (ev.data === 'peer-exchange-tab-inactivated') {
      this.store.dispatch(new fromLibsExchangeExplorerActions.ResetInitiallyLoadedExchangeExplorerState());
    }
  }

  inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  setQueryParamMembers(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.companyJobId = +queryParamMap.get('companyJobId') || 0;
    this.companyPayMarketId = +queryParamMap.get('companyPayMarketId') || 0;
    this.userSessionId = +queryParamMap.get('userSessionId') || 0;
    this.isPayMarketOverride = queryParamMap.get('isPayMarketOverride') === 'true';
    this.cutGuid = queryParamMap.get('dataCutGuid') || null;
    this.userJobMatchId = +queryParamMap.get('userJobMatchId') || 0;

    this.upsertEntityConfiguration = {
      ...this.upsertEntityConfiguration,
      BaseEntityId: this.userJobMatchId,
      ParentEntityId: this.userSessionId
    };
  }
}

