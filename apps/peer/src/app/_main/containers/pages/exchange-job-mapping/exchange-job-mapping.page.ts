import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobMappingActions from '../../../actions/exchange-job-mapping.actions';
import * as fromPeerMainReducer from '../../../reducers';
import { ExchangeJobMappingService } from '../../../services';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pf-exchange-job-mapping-page',
  templateUrl: './exchange-job-mapping.page.html',
  styleUrls: ['./exchange-job-mapping.page.scss']
})
export class ExchangeJobMappingPageComponent {
  gridPageRowIndexToScrollTo$: Observable<number>;
  exchangeId: number;
  collapse = false;
  disableGridScollTo = false;

  constructor(
    private store: Store<fromPeerMainReducer.State>,
    private route: ActivatedRoute,
    private exchangeJobMappingService: ExchangeJobMappingService
  ) {
    this.exchangeId = this.route.snapshot.params.id;
    this.gridPageRowIndexToScrollTo$ = this.store.select(fromPeerMainReducer.getExchangeJobMappingPageRowIndexToScrollTo);
  }

  handleBackToListNavigation(): void {
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobMapping));
    this.store.dispatch(new fromExchangeJobMappingActions.UpdateExchangeJobMappingsQuery(''));
  }

  handleSearchChanged(query: string): void {
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.ExchangeJobMapping, { skip: 0, take: 20 }));
    this.store.dispatch(new fromExchangeJobMappingActions.UpdateExchangeJobMappingsQuery(query));
    this.exchangeJobMappingService.loadExchangeJobMappings(this.exchangeId);
  }

  handleExchangeJobMappingInfoClosed() {
    // Need to clear out the index so clicking on the same row will cause a change to the scrollTo Directive
    this.store.dispatch(new fromExchangeJobMappingActions.UpdatePageRowIndexToScrollTo(null));
    this.collapse = false;
    this.disableGridScollTo = false;
  }

  handleGridRowSelected() {
     if (this.collapse) {
      this.disableGridScollTo = true;
     }

    this.collapse = true;
  }
}
