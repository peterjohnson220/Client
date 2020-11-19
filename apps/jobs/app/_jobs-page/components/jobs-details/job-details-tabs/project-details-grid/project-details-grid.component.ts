import { Component, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import { PfThemeType } from 'libs/features/pf-data-grid/enums/pf-theme-type.enum';

import * as fromJobsPageReducer from '../../../../reducers';
import { PageViewIds } from '../../../../constants';

@Component({
  selector: 'pf-project-details-grid',
  templateUrl: './project-details-grid.component.html',
  styleUrls: ['./project-details-grid.component.scss']
})
export class ProjectDetailsGridComponent implements AfterViewInit, OnDestroy, OnChanges {
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
  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  selectedPayMarket: any;
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;

  constructor(
    private store: Store<fromJobsPageReducer.State>
    ) {
    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });
    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          { Value: this.payMarketField.FilterValue, Id: this.payMarketField.FilterValue } : null;
      }
    });
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
  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.payMarketField);
    field.FilterValue = value.Id;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  updateField(field) {
    if (field.FilterValue) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pageViewId, field));
    }
  }
  handleFilter(value) {
    this.filteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

}
