import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { ExchangeJobMapping, ExchangeRequestTypeEnum } from 'libs/models/peer';

import * as fromExchangeJobMappingGridActions from '../../../actions/exchange-job-mapping-grid.actions';
import * as fromPeerManagementReducer from '../../../reducers';
import { ExchangeJobMappingService } from '../../../services';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';

@Component({
  selector: 'pf-exchange-job-mapping-page',
  templateUrl: './exchange-job-mapping.page.html',
  styleUrls: ['./exchange-job-mapping.page.scss']
})
export class ExchangeJobMappingPageComponent implements OnInit, OnDestroy {
  exchangeId: number;
  collapse = false;
  disableGridScollTo = false;

  gridPageRowIndexToScrollTo$: Observable<number>;
  selectedExchangeJobMapping$: Observable<ExchangeJobMapping>;
  selectedExchangeJobMappingSubscription: Subscription;

  constructor(
    private store: Store<fromPeerManagementReducer.State>,
    private route: ActivatedRoute,
    private exchangeJobMappingService: ExchangeJobMappingService
  ) {
    this.exchangeId = this.route.snapshot.params.id;
    this.gridPageRowIndexToScrollTo$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingPageRowIndexToScrollTo);
    this.selectedExchangeJobMapping$ = this.store.select(fromPeerManagementReducer.getSelectedExchangeJobMapping);
  }

  handleSearchChanged(query: string): void {
    this.store.dispatch(new fromGridActions.UpdateFilter(
      GridTypeEnum.ExchangeJobMapping,
      {columnName: 'ExchangeJobTitle', value: query}
    ));
    this.exchangeJobMappingService.loadExchangeJobMappings(this.exchangeId);
  }

  handleExchangeJobMappingInfoClosed() {
    // Need to clear out the index so clicking on the same row will cause a change to the scrollTo Directive
    this.store.dispatch(new fromExchangeJobMappingGridActions.UpdatePageRowIndexToScrollTo(null));
    this.store.dispatch(new fromExchangeJobMappingGridActions.SelectExchangeJobMapping(null));
    this.collapse = false;
    this.disableGridScollTo = false;
  }

  requestJobButtonClick() {
    this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.PayfactorsJob));
  }

  // Lifecycle
  ngOnInit() {
    this.selectedExchangeJobMappingSubscription = this.selectedExchangeJobMapping$.subscribe(selectedMapping => {
      this.disableGridScollTo = this.collapse;
      this.collapse = !!selectedMapping;
    });
  }

  ngOnDestroy() {
    this.selectedExchangeJobMappingSubscription.unsubscribe();
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobMapping));
    this.store.dispatch(new fromExchangeJobMappingGridActions.SelectExchangeJobMapping(null));
  }
}
