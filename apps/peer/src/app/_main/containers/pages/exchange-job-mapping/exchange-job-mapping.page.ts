import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { ExchangeJobMapping } from 'libs/models/peer';

import * as fromExchangeJobMappingGridActions from '../../../actions/exchange-job-mapping-grid.actions';
import * as fromPeerMainReducer from '../../../reducers';
import { ExchangeJobMappingService } from '../../../services';

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
    private store: Store<fromPeerMainReducer.State>,
    private route: ActivatedRoute,
    private exchangeJobMappingService: ExchangeJobMappingService
  ) {
    this.exchangeId = this.route.snapshot.params.id;
    this.gridPageRowIndexToScrollTo$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingPageRowIndexToScrollTo);
    this.selectedExchangeJobMapping$ = this.store.select(fromPeerMainReducer.getSelectedExchangeJobMapping);
  }

  handleBackToListNavigation(): void {
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobMapping));
    this.store.dispatch(new fromExchangeJobMappingGridActions.UpdateExchangeJobMappingsQuery(''));
    this.store.dispatch(new fromExchangeJobMappingGridActions.SelectExchangeJobMapping(null));
  }

  handleSearchChanged(query: string): void {
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.ExchangeJobMapping, { skip: 0, take: 20 }));
    this.store.dispatch(new fromExchangeJobMappingGridActions.UpdateExchangeJobMappingsQuery(query));
    this.exchangeJobMappingService.loadExchangeJobMappings(this.exchangeId);
  }

  handleExchangeJobMappingInfoClosed() {
    // Need to clear out the index so clicking on the same row will cause a change to the scrollTo Directive
    this.store.dispatch(new fromExchangeJobMappingGridActions.UpdatePageRowIndexToScrollTo(null));
    this.store.dispatch(new fromExchangeJobMappingGridActions.SelectExchangeJobMapping(null));
    this.collapse = false;
    this.disableGridScollTo = false;
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
  }
}
