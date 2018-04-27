import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import { GridTypeEnum} from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeJobComparisonGridActions from '../../actions/exchange-job-comparison-grid.actions';
import * as fromPeerMainReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-job-comparison-grid',
  templateUrl: './exchange-job-comparison-grid.component.html',
  styleUrls: ['./exchange-job-comparison-grid.component.scss']
})
export class ExchangeJobComparisonGridComponent implements OnInit, OnDestroy {
  @Input() exchangeId: number;

  loadingExchangeJobComparisons$: Observable<boolean>;
  loadingExchangeJobComparisonsError$: Observable<boolean>;
  exchangeJobComparisonsGridData$: Observable<GridDataResult>;
  exchangeJobComparisonsGridState$: Observable<State>;
  exchangeJobComparisonGridStateSubscription: Subscription;
  exchangeJobComparisonGridState: State;
  public colors: any[] = [{
    to: 25,
    color: '#f31700'
  }, {
    from: 25,
    to: 50,
    color: '#ffc000'
  }, {
    from: 50,
    to: 75,
    color: '#0058e9'
  }, {
    from: 75,
    color: '#37b400'
  }];

  constructor(
    private store: Store<fromPeerMainReducer.State>
  ) {
    this.loadingExchangeJobComparisons$ = this.store.select(fromPeerMainReducer.getExchangeJobComparisonsLoading);
    this.loadingExchangeJobComparisonsError$ = this.store.select(fromPeerMainReducer.getExchangeJobComparisonsLoadingError);
    this.exchangeJobComparisonsGridData$ = this.store.select(fromPeerMainReducer.getExchangeJobComparisonsGridData);
    this.exchangeJobComparisonsGridState$ = this.store.select(fromPeerMainReducer.getExchangeJobComparisonsGridState);
  }

  // Grid
  handleDataStateChange(state: DataStateChangeEvent): void {
    console.log('handleDataStateChange: ', state);
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeJobComparison, state));
    this.store.dispatch(new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons);
  }

  // getExchangeIndexValue(exchangeIndex: number): string {
  //   const distanceFromMidpoint = Math.abs(exchangeIndex - 100);
  //   return distanceFromMidpoint.toFixed(2) + '%';
  // }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons);

    this.exchangeJobComparisonGridStateSubscription = this.exchangeJobComparisonsGridState$.subscribe(gridState => {
      this.exchangeJobComparisonGridState = cloneDeep(gridState);
    });
  }

  ngOnDestroy() {
    this.exchangeJobComparisonGridStateSubscription.unsubscribe();
  }
}
