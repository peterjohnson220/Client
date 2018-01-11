import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/common/core/actions/grid.actions';

import * as fromExchangeJobMappingActions from '../../../actions/exchange-job-mapping.actions';
import * as fromPeerMainReducer from '../../../reducers';
import { ExchangeJobMappingService } from '../../../services';

@Component({
  selector: 'pf-exchange-job-mapping-page',
  templateUrl: './exchange-job-mapping.page.html',
  styleUrls: ['./exchange-job-mapping.page.scss']
})
export class ExchangeJobMappingPageComponent {
  exchangeId: number;

  constructor(
    private store: Store<fromPeerMainReducer.State>,
    private route: ActivatedRoute,
    private exchangeJobMappingService: ExchangeJobMappingService
  ) {
    this.exchangeId = this.route.snapshot.params.id;
  }

  handleBackToListNavigation(): void {
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobMapping));
  }

  handleSearchChanged(query: string): void {
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.ExchangeJobMapping, { skip: 0, take: 20 }));
    this.store.dispatch(new fromExchangeJobMappingActions.UpdateExchangeJobMappingsQuery(query));
    this.exchangeJobMappingService.loadExchangeJobMappings(this.exchangeId);
  }
}
