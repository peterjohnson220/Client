import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncStateObj } from 'libs/models';

import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromBasicDataGridActions from 'libs/features/grids/basic-data-grid/actions/basic-data-grid.actions';
import { MarketDataConfig, MarketDataJobPricing } from '../../models';
import { BasicDataViewField, DataViewFilter } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-market-data',
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.scss']
})
export class MarketDataComponent implements OnChanges {
  @Input() jobPricing: MarketDataJobPricing;

  pricingMatches$: Observable<AsyncStateObj<any[]>>;

  marketDataId = MarketDataConfig.marketDataGridId;
  baseEntity = MarketDataConfig.baseEntity;
  fields = MarketDataConfig.fields;
  fieldGroups = ['Base', 'TCC'];
  rate: string;

  constructor(
    private basicGridStore: Store<fromBasicDataGridReducer.State>
  ) {
    this.pricingMatches$ = this.basicGridStore.select(fromBasicDataGridReducer.getData, this.marketDataId);
    this.initGrid();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.jobPricing?.currentValue && changes.jobPricing.currentValue.Id !== 0
        && changes.jobPricing.currentValue.Id !== changes.jobPricing.previousValue?.Id) {
      this.updateFilters();
      this.rate = this.jobPricing.Rate;
    }
  }

  trackByField(index, field: BasicDataViewField) {
    return field.KendoGridField;
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
}
