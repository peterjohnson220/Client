import { Component, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/grids/pf-data-grid/actions';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums';
import { GroupedListItem } from 'libs/models';
import * as fromFeatureFlagRedirectReducer from 'libs/state/state';
import { UrlPage } from 'libs/models/url-redirect/url-page';

import * as fromJobsPageReducer from '../../../../reducers';
import { PageViewIds } from '../../../../constants';

@Component({
  selector: 'pf-project-details-grid',
  templateUrl: './project-details-grid.component.html',
  styleUrls: ['./project-details-grid.component.scss']
})
export class ProjectDetailsGridComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {
  @Input() filters: PfDataGridFilter[];
  @ViewChild('projectAccessColumn') projectAccessColumn: ElementRef;
  @ViewChild('payMarketFilter') payMarketFilter: ElementRef;

  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket'];
  pageViewId = PageViewIds.Projects;

  colTemplates = {};
  pfThemeType = PfThemeType;

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'UserSessions_Session_Name'
  }];

  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;

  pricingProjectSlug$: Observable<string>;
  redirectSlugLoading$: Observable<boolean>;
  redirectSlugLoadingError$: Observable<boolean>;

  payMarketField: ViewField;
  payMarketOptions: GroupedListItem[];
  selectedPayMarkets: string[];
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;

  constructor(
    private store: Store<fromJobsPageReducer.State>
    ) {

    this.pricingProjectSlug$ = this.store.select(fromFeatureFlagRedirectReducer.getPageRedirectUrl, {page: UrlPage.PricingProject});
    this.redirectSlugLoading$ = this.store.select(fromFeatureFlagRedirectReducer.getLoading);
    this.redirectSlugLoadingError$ = this.store.select(fromFeatureFlagRedirectReducer.getLoadingError);

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ActionBarClassName: 'ml-0 mr-3 mt-1'
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
  }

  ngOnInit() {
    this.companyPayMarketsSubscription = this.store.select(fromJobsPageReducer.getPayMarketGroupedListItems)
      .subscribe(o => {
        if (!!o) {
          this.payMarketOptions = cloneDeep(o);
        }
      });
    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.selectedPayMarkets = this.payMarketField.FilterValues === null ? [] : cloneDeep(this.payMarketField.FilterValues);
      }
    });
  }

  ngAfterViewInit() {
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalFiltersTemplates: {
        'PayMarket': this.payMarketFilter
      }
    };
    this.colTemplates = {
      'HasProjectAccess': { Template: this.projectAccessColumn }
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.filters = cloneDeep(changes['filters'].currentValue)
        .filter(f => this.inboundFiltersToApply.indexOf(f.SourceName) > -1);
    }
  }

  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
  }

  handlePayMarketValueChanged(payMarkets: GroupedListItem[]) {
    const field: ViewField = cloneDeep(this.payMarketField);
    field.FilterValues = payMarkets?.length > 0 ? payMarkets.map(x => x.Value) : null;
    field.FilterOperator = 'in';
    this.updateField(field);
  }

  updateField(field: ViewField) {
    if (!!field.FilterValues) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pageViewId, field));
    }
  }

}
