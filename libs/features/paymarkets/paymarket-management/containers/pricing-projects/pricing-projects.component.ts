import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models';
import { BasicDataViewField, DataViewFieldDataType, DataViewFilter } from 'libs/models/payfactors-api';
import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromBasicDataGridActions from 'libs/features/grids/basic-data-grid/actions/basic-data-grid.actions';

import { PayMarketAssociationType } from '../../models';
import { PayMarketAssociationsHelper } from '../../helpers';

@Component({
  selector: 'pf-pricing-projects',
  templateUrl: './pricing-projects.component.html',
  styleUrls: ['./pricing-projects.component.scss']
})
export class PricingProjectsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() companyPaymarketId: number;
  @Input() totalCount: number;

  pricingProjects$: Observable<AsyncStateObj<any[]>>;
  fields$: Observable<BasicDataViewField[]>;
  loadingMoreData$: Observable<boolean>;

  pricingProjectsSubscription: Subscription;
  currentRecordCount: number;

  baseEntity = 'UserJobListTemp';
  pricingProjectsFields: BasicDataViewField[] = [
    {
      EntitySourceName: 'UserSessions',
      SourceName: 'UserSession_ID',
      IsHidden: true
    },
    {
      EntitySourceName: 'UserSessions',
      SourceName: 'Session_Name',
      DisplayName: 'Project Name',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'UserSessions_Session_Name',
      SortOrder: 0,
      SortDirection: 'asc'
    },
    {
      EntitySourceName: 'Users',
      SourceName: 'First_Name',
      DisplayName: 'First Name',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'Users_First_Name'
    },
    {
      EntitySourceName: 'Users',
      SourceName: 'Last_Name',
      DisplayName: 'Last Name',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'Users_Last_Name'
    },
    {
      EntitySourceName: 'UserScopeListTemp',
      SourceName: 'CompanyPayMarket_ID',
      IsHidden: true
    }
  ];

  constructor(
    private basicGridStore: Store<fromBasicDataGridReducer.State>
  ) {
    this.pricingProjects$ = this.basicGridStore.select(fromBasicDataGridReducer.getData, PayMarketAssociationType.PricingProjects);
    this.fields$ = this.basicGridStore.select(fromBasicDataGridReducer.getVisibleFields, PayMarketAssociationType.PricingProjects);
    this.loadingMoreData$ = this.basicGridStore.select(fromBasicDataGridReducer.getLoadingMoreData, PayMarketAssociationType.PricingProjects);
    this.initAssociationsGrids();
  }

  ngOnInit(): void {
    this.pricingProjectsSubscription = this.pricingProjects$.subscribe((asyncObj) => {
      if (asyncObj?.obj?.length) {
        this.currentRecordCount = asyncObj.obj.length;
      }
    });
    this.basicGridStore.dispatch(new fromBasicDataGridActions.GetData(PayMarketAssociationType.PricingProjects));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes?.companyPaymarketId?.currentValue) {
      this.updateFilters(changes.companyPaymarketId.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.pricingProjectsSubscription.unsubscribe();
  }

  handleScrollBottom(): void {
    if (this.currentRecordCount < this.totalCount) {
      this.basicGridStore.dispatch(new fromBasicDataGridActions.GetMoreData(PayMarketAssociationType.PricingProjects));
    }
  }

  private initAssociationsGrids(): void {
    this.basicGridStore.dispatch(new fromBasicDataGridActions.InitGrid(
      PayMarketAssociationType.PricingProjects,
      {
        BaseEntity: this.baseEntity,
        ApplyDefaultFilters: true,
        Fields: this.pricingProjectsFields,
        Filters: [],
        Distinct: true
      }
    ));
  }

  private updateFilters(payMarketId: number): void {
    const pricingProjectsFilters: DataViewFilter[] = PayMarketAssociationsHelper.getPayMarketFilters('UserScopeListTemp', payMarketId);
    pricingProjectsFilters.push({
      EntitySourceName: 'UserSessions',
      SourceName: 'UserSession_ID',
      FilterType: 'ProjectNotOrphanedFilterStrategy',
      Operator: null
    });
    this.basicGridStore.dispatch(new fromBasicDataGridActions.UpdateFilters(PayMarketAssociationType.PricingProjects, pricingProjectsFilters));
  }

}
