import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models';
import { BasicDataViewField, DataViewFilter, DataViewFieldDataType } from 'libs/models/payfactors-api';
import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromBasicDataGridActions from 'libs/features/grids/basic-data-grid/actions/basic-data-grid.actions';

import { PayMarketAssociationType } from '../../models';
import { PayMarketAssociationsHelper } from '../../helpers';

@Component({
  selector: 'pf-employee-records',
  templateUrl: './employee-records.component.html',
  styleUrls: ['./employee-records.component.scss']
})
export class EmployeeRecordsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() companyPaymarketId: number;
  @Input() totalCount: number;

  data$: Observable<AsyncStateObj<any[]>>;
  fields$: Observable<BasicDataViewField[]>;
  loadingMoreData$: Observable<boolean>;

  dataSubscription: Subscription;

  currentRecordCount: number;

  baseEntity = 'CompanyEmployees';
  employeeRecordsFields: BasicDataViewField[] = [
    {
      EntitySourceName: 'CompanyEmployees',
      SourceName: 'First_Name',
      DisplayName: 'First Name',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CompanyEmployees_First_Name'
    },
    {
      EntitySourceName: 'CompanyEmployees',
      SourceName: 'Last_Name',
      DisplayName: 'Last Name',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CompanyEmployees_Last_Name',
      SortOrder: 0,
      SortDirection: 'asc'
    },
    {
      EntitySourceName: 'CompanyEmployees',
      SourceName: 'Employee_ID',
      DisplayName: 'Employee ID',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CompanyEmployees_Employee_ID'
    },
    {
      EntitySourceName: 'CompanyJobs',
      SourceName: 'Job_Code',
      DisplayName: 'Job Code',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CompanyJobs_Job_Code'
    },
    {
      EntitySourceName: 'CompanyJobs',
      SourceName: 'Job_Title',
      DisplayName: 'Job Title',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CompanyJobs_Job_Title'
    }
  ];

  constructor(
    private basicGridStore: Store<fromBasicDataGridReducer.State>
  ) {
    this.data$ = this.basicGridStore.select(fromBasicDataGridReducer.getData, PayMarketAssociationType.EmployeeRecords);
    this.fields$ = this.basicGridStore.select(fromBasicDataGridReducer.getVisibleFields, PayMarketAssociationType.EmployeeRecords);
    this.loadingMoreData$ = this.basicGridStore.select(fromBasicDataGridReducer.getLoadingMoreData, PayMarketAssociationType.EmployeeRecords);
    this.initGrid();
  }

  ngOnInit(): void {
    this.dataSubscription = this.data$.subscribe((asyncObj) => {
      if (asyncObj?.obj?.length) {
        this.currentRecordCount = asyncObj.obj.length;
      }
    });
    this.basicGridStore.dispatch(new fromBasicDataGridActions.GetData(PayMarketAssociationType.EmployeeRecords));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes?.companyPaymarketId?.currentValue) {
      this.updateFilters(changes.companyPaymarketId.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  onScroll(): void {
    if (this.currentRecordCount < this.totalCount) {
      this.basicGridStore.dispatch(new fromBasicDataGridActions.GetMoreData(PayMarketAssociationType.EmployeeRecords));
    }
  }

  private initGrid(): void {
    this.basicGridStore.dispatch(new fromBasicDataGridActions.InitGrid(
      PayMarketAssociationType.EmployeeRecords,
      {
        BaseEntity: this.baseEntity,
        ApplyDefaultFilters: true,
        Fields: this.employeeRecordsFields,
        Filters: []
      }
    ));
  }

  private updateFilters(companyPaymarketId: number): void {
    const filters: DataViewFilter[] = PayMarketAssociationsHelper.getPayMarketFilters(this.baseEntity, companyPaymarketId);
    this.basicGridStore.dispatch(new fromBasicDataGridActions.UpdateFilters(PayMarketAssociationType.EmployeeRecords, filters));
  }
}
