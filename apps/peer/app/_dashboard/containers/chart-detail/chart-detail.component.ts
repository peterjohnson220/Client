import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { ChartItem, ExchangeChartTypeEnum } from 'libs/models';
import { EntityDescriptionTypeEnum } from 'libs/models/entity-description/entity-description-type.enum';

import * as fromPeerDashboardReducer from '../../reducers';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';

@Component({
  selector: 'pf-chart-detail-component',
  templateUrl: './chart-detail.component.html',
  styleUrls: ['./chart-detail.component.scss']
})
export class ChartDetailComponent implements OnInit, OnDestroy {
  detailChartType$: Observable<string>;
  detailChartCategory$: Observable<string>;
  detailChartItems$: Observable<ChartItem[]>;
  loadingDetailChartItems$: Observable<boolean>;
  loadingDetailChartItemsError$: Observable<boolean>;

  detailChartTypeSubscription: Subscription;
  detailChartCategorySubscription: Subscription;
  detailChartItemsSubscription: Subscription;

  detailChartType: ExchangeChartTypeEnum;
  detailChartCategory: ExchangeChartTypeEnum;

  detailChartItems: ChartItem[];
  filteredChartItems: ChartItem[];

  clearSearch = new BehaviorSubject<boolean>(false);
  clearSearch$ = this.clearSearch.asObservable();

  constructor(
    private store: Store<fromPeerDashboardReducer.State>
  ) {
    this.detailChartType$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardDetailChartType);
    this.detailChartCategory$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardDetailChartCategory);
    this.detailChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardDetailChartItems);
    this.loadingDetailChartItems$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingDetailChart);
    this.loadingDetailChartItemsError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardLoadingDetailChartError);
  }

  get isCompanyChartType(): boolean {
    return this.detailChartType === ExchangeChartTypeEnum.Company;
  }

  get cardHeaderText(): string {
    switch (this.detailChartType) {
      case  ExchangeChartTypeEnum.ExchangeJobOrgs :
        return 'Exchange Job Orgs by Contribution';
      case  ExchangeChartTypeEnum.Company :
        return this.detailChartCategory === ExchangeChartTypeEnum.Subsidiary ? 'Participating Properties by Contribution' : 'Participating Companies by Contribution';
      default:
        return 'Participating Companies by Contribution';
    }
  }

  get companyParticipantType(): string {
    return this.detailChartCategory === ExchangeChartTypeEnum.Subsidiary ? 'properties' : 'companies';
  }

  get searchChartDetailsPlaceholderMessage(): string {
    if (this.isCompanyChartType && this.detailChartCategory === ExchangeChartTypeEnum.Subsidiary) {
      return 'Search for a Property...';
    }
    return 'Search for a Company...';
  }

  closeSidebar(): void {
    this.store.dispatch(new fromExchangeDashboardActions.CloseSidebar());
  }

  ngOnInit(): void {
    this.detailChartTypeSubscription = this.detailChartType$.subscribe(ct => {
      this.detailChartType = ct as ExchangeChartTypeEnum;
    });
    this.detailChartCategorySubscription = this.detailChartCategory$.subscribe(cc => {
      this.detailChartCategory = cc as ExchangeChartTypeEnum;
    });
    this.detailChartItemsSubscription = this.detailChartItems$.subscribe( i => {
      this.detailChartItems = i;
      this.filteredChartItems = i;
      this.clearSearch.next(true);
    });
  }

  ngOnDestroy(): void {
    this.detailChartTypeSubscription.unsubscribe();
    this.detailChartCategorySubscription.unsubscribe();
    this.detailChartItemsSubscription.unsubscribe();
  }

  getEntityType() {
    if (this.detailChartCategory === ExchangeChartTypeEnum.Subsidiary) {
      return EntityDescriptionTypeEnum.Subsidiary;
    } else {
      return EntityDescriptionTypeEnum.Company;
    }
  }

  handleSearchValueChanged($event: string) {
    this.filteredChartItems = this.detailChartItems.filter(x => x.Category.toLowerCase().indexOf($event.toLowerCase()) > -1);
  }
}
