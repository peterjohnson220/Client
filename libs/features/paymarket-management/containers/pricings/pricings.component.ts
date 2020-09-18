import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models';
import {BasicDataViewField, DataViewFieldDataType, DataViewFilter} from 'libs/models/payfactors-api';
import * as fromBasicDataGridReducer from 'libs/features/basic-data-grid/reducers';
import * as fromBasicDataGridActions from 'libs/features/basic-data-grid/actions/basic-data-grid.actions';

import { PayMarketAssociationType } from '../../models';
import { PayMarketAssociationsHelper } from '../../helpers';

@Component({
  selector: 'pf-pricings',
  templateUrl: './pricings.component.html'
})
export class PricingsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() companyPaymarketId: number;
  @Input() totalCount: number;

  pricings$: Observable<AsyncStateObj<any[]>>;
  fields$: Observable<BasicDataViewField[]>;
  loadingMoreData$: Observable<boolean>;

  pricingsSubscription: Subscription;

  currentRecordCount: number;
  baseEntity = 'CompanyJobs_Pricings';
  pricingFields: BasicDataViewField[] = [
    {
      EntitySourceName: 'CompanyJobs',
      SourceName: 'Job_Title',
      DisplayName: 'Job Title',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CompanyJobs_Job_Title',
      SortOrder: 0,
      SortDirection: 'asc'
    },
    {
      EntitySourceName: 'CompanyJobs',
      SourceName: 'Job_Code',
      DisplayName: 'Job Code',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CompanyJobs_Job_Code'
    },
    {
      EntitySourceName: 'CompanyJobs_Pricings',
      SourceName: 'Effective_Date',
      DisplayName: 'Effective Date',
      DataType: DataViewFieldDataType.DateTime,
      KendoGridField: 'CompanyJobs_Pricings_Effective_Date',
      SortOrder: 1,
      SortDirection: 'asc'
    }
  ];

  constructor(
    private basicGridStore: Store<fromBasicDataGridReducer.State>
  ) {
    this.pricings$ = this.basicGridStore.select(fromBasicDataGridReducer.getData, PayMarketAssociationType.PublishedPricings);
    this.fields$ = this.basicGridStore.select(fromBasicDataGridReducer.getVisibleFields, PayMarketAssociationType.PublishedPricings);
    this.loadingMoreData$ = this.basicGridStore.select(fromBasicDataGridReducer.getLoadingMoreData, PayMarketAssociationType.PublishedPricings);
    this.initGrid();
  }

  ngOnInit(): void {
    this.pricingsSubscription = this.pricings$.subscribe((asyncObj) => {
      if (asyncObj?.obj?.length) {
        this.currentRecordCount = asyncObj.obj.length;
      }
    });
    this.basicGridStore.dispatch(new fromBasicDataGridActions.GetData(PayMarketAssociationType.PublishedPricings));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes?.companyPaymarketId?.currentValue) {
      this.updateFilters(changes.companyPaymarketId.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.pricingsSubscription.unsubscribe();
  }

  handleScrollBottom(): void {
    if (this.currentRecordCount < this.totalCount) {
      this.basicGridStore.dispatch(new fromBasicDataGridActions.GetMoreData(PayMarketAssociationType.PublishedPricings));
    }
  }

  private initGrid(): void {
    this.basicGridStore.dispatch(new fromBasicDataGridActions.InitGrid(
      PayMarketAssociationType.PublishedPricings,
      {
        BaseEntity: this.baseEntity,
        ApplyDefaultFilters: false,
        Fields: this.pricingFields,
        Filters: []
      }
    ));
  }

  private updateFilters(companyPaymarketId: number): void {
    const filters: DataViewFilter[] = PayMarketAssociationsHelper.getPayMarketFilters(this.baseEntity, companyPaymarketId);
    this.basicGridStore.dispatch(new fromBasicDataGridActions.UpdateFilters(PayMarketAssociationType.PublishedPricings, filters));
  }
}
