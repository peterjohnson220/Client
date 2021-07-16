import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';

import { AsyncStateObj } from 'libs/models';
import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromBasicDataGridActions from 'libs/features/grids/basic-data-grid/actions/basic-data-grid.actions';
import * as fromMultiMatchActions from 'libs/features/pricings/multi-match/actions';
import { BasicDataViewField, DataViewFilter } from 'libs/models/payfactors-api';

import * as fromModifyPricingsActions from '../../actions/modify-pricings.actions';
import { MarketDataConfig, MarketDataJobPricing } from '../../models';

@Component({
  selector: 'pf-market-data',
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.scss']
})
export class MarketDataComponent implements OnChanges, OnInit, OnDestroy {
  @Input() jobPricing: MarketDataJobPricing;

  pricingMatches$: Observable<AsyncStateObj<any[]>>;

  showMatchDetailsModal: BehaviorSubject<boolean>;
  showMatchDetailsModal$: Observable<boolean>;

  modifyPricingsSubscription: Subscription;

  marketDataId = MarketDataConfig.marketDataGridId;
  baseEntity = MarketDataConfig.baseEntity;
  fields = MarketDataConfig.fields;
  fieldGroups = ['Base', 'TCC'];
  rate: string;
  selectedPricingMatch: any;

  constructor(
    private basicGridStore: Store<fromBasicDataGridReducer.State>,
    private actionsSubject: ActionsSubject
  ) {
    this.pricingMatches$ = this.basicGridStore.select(fromBasicDataGridReducer.getData, this.marketDataId);
    this.showMatchDetailsModal = new BehaviorSubject<boolean>(false);
    this.showMatchDetailsModal$ = this.showMatchDetailsModal.asObservable();

    this.initGrid();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.jobPricing?.currentValue && changes.jobPricing.currentValue.Id !== 0
        && changes.jobPricing.currentValue.Id !== changes.jobPricing.previousValue?.Id) {
      this.updateFilters();
      this.rate = this.jobPricing.Rate;
    }
  }

  ngOnInit(): void {
    this.modifyPricingsSubscription = this.actionsSubject.pipe(
      ofType(fromModifyPricingsActions.UPDATING_PRICING_MATCH_SUCCESS,
        fromModifyPricingsActions.DELETING_PRICING_MATCH_SUCCESS,
        fromModifyPricingsActions.UPDATING_PRICING_SUCCESS,
        fromMultiMatchActions.MODIFY_PRICINGS_SUCCESS)
    ).subscribe(data => {
      this.getData();
    });
  }

  ngOnDestroy(): void {
    this.modifyPricingsSubscription.unsubscribe();
  }

  trackByField(index, field: BasicDataViewField) {
    return field.KendoGridField;
  }

  openMatchDetailsModal(pricingMatch: any): void {
    this.selectedPricingMatch = pricingMatch;
    this.showMatchDetailsModal.next(true);
  }

  closeMatchDetailsModal(): void {
    this.selectedPricingMatch = null;
    this.showMatchDetailsModal.next(false);
  }

  private initGrid(): void {
    this.basicGridStore.dispatch(new fromBasicDataGridActions.InitGrid(
      this.marketDataId,
      {
        BaseEntity: this.baseEntity,
        ApplyDefaultFilters: false,
        Fields: this.fields,
        Filters: [],
        Distinct: true
      }
    ));
  }

  private updateFilters(): void {
    const filters: DataViewFilter[] = MarketDataConfig.getFilters(this.jobPricing.Id);
    this.basicGridStore.dispatch(new fromBasicDataGridActions.UpdateFilters(this.marketDataId, filters));
  }

  private getData(): void {
    this.basicGridStore.dispatch(new fromBasicDataGridActions.GetData(this.marketDataId));
  }
}
