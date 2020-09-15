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
  selector: 'pf-structures',
  templateUrl: './structures.component.html'
})
export class StructuresComponent implements OnInit, OnChanges, OnDestroy {
  @Input() companyPaymarketId: number;
  @Input() totalCount: number;

  structures$: Observable<AsyncStateObj<any[]>>;
  fields$: Observable<BasicDataViewField[]>;
  loadingMoreData$: Observable<boolean>;

  structuresSubscription: Subscription;

  currentRecordCount: number;
  baseEntity = 'CompanyStructures_RangeGroup';
  structuresFields: BasicDataViewField[] = [
    {
      EntitySourceName: 'CompanyStructures',
      SourceName: 'Structure_Name',
      DisplayName: 'Structure Name',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CompanyStructures_Structure_Name',
      SortOrder: 0,
      SortDirection: 'asc'
    },
    {
      EntitySourceName: 'CompanyStructures_RangeGroup',
      SourceName: 'CompanyPayMarket_ID',
      DisplayName: 'CompanyPayMarket_ID',
      DataType: DataViewFieldDataType.Int,
      KendoGridField: 'CompanyStructures_RangeGroup_CompanyPayMarket_ID',
      IsHidden: true
    }
  ];

  constructor(
    private basicGridStore: Store<fromBasicDataGridReducer.State>
  ) {
    this.structures$ = this.basicGridStore.select(fromBasicDataGridReducer.getData, PayMarketAssociationType.Structures);
    this.fields$ = this.basicGridStore.select(fromBasicDataGridReducer.getVisibleFields, PayMarketAssociationType.Structures);
    this.loadingMoreData$ = this.basicGridStore.select(fromBasicDataGridReducer.getLoadingMoreData, PayMarketAssociationType.Structures);
    this.initGrid();
  }

  ngOnInit(): void {
    this.structuresSubscription = this.structures$.subscribe((asyncObj) => {
      if (asyncObj?.obj?.length) {
        this.currentRecordCount = asyncObj.obj.length;
      }
    });
    this.basicGridStore.dispatch(new fromBasicDataGridActions.GetData(PayMarketAssociationType.Structures));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes?.companyPaymarketId?.currentValue) {
      this.updateFilters(changes.companyPaymarketId.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.structuresSubscription.unsubscribe();
  }

  handleScrollBottom(): void {
    if (this.currentRecordCount < this.totalCount) {
      this.basicGridStore.dispatch(new fromBasicDataGridActions.GetMoreData(PayMarketAssociationType.Structures));
    }
  }

  private initGrid(): void {
    this.basicGridStore.dispatch(new fromBasicDataGridActions.InitGrid(
      PayMarketAssociationType.Structures,
      {
        BaseEntity: this.baseEntity,
        ApplyDefaultFilters: false,
        Fields: this.structuresFields,
        Filters: [],
        Distinct: true
      }
    ));
  }

  private updateFilters(companyPaymarketId: number): void {
    const filters: DataViewFilter[] = PayMarketAssociationsHelper.getPayMarketFilters('CompanyStructures_RangeGroup', companyPaymarketId);
    this.basicGridStore.dispatch(new fromBasicDataGridActions.UpdateFilters(PayMarketAssociationType.Structures, filters));
  }
}
