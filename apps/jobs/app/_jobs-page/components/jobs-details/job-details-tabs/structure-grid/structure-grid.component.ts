import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';

import * as cloneDeep from 'lodash.clonedeep';

import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';

import * as fromJobsPageReducer from '../../../../reducers';

import { PageViewIds } from '../../../../constants';

@Component({
  selector: 'pf-structure-grid',
  templateUrl: './structure-grid.component.html',
  styleUrls: ['./structure-grid.component.scss']
})
export class StructureGridComponent implements AfterViewInit, OnDestroy {
  @Input() filters: PfDataGridFilter[];

  @ViewChild('nameColumn', { static: false }) nameColumn: ElementRef;
  @ViewChild('currencyColumn', { static: false }) currencyColumn: ElementRef;
  @ViewChild('payMarketFilter', { static: false }) payMarketFilter: ElementRef;

  pageViewId = PageViewIds.Structures;
  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket'];
  colTemplates = {};
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'vw_CompanyJobsStructureInfo_Structure_Search'
  }];
  gridFieldSubscription: Subscription;
  companyPayMarketSubscription: Subscription;
  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  selectedPayMarket: any;
  actionBarConfig: ActionBarConfig;

  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.companyPayMarketSubscription = this.store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });

    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket' && f.IsGlobalFilter);
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          { Value: this.payMarketField.FilterValue, Id: this.payMarketField.FilterValue } : null;
      }
    });
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ActionBarClassName: 'structure-grid-action-bar ml-0 mt-1'
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
      'Structure_Search': { Template: this.nameColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn }
    };
  }
  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketSubscription.unsubscribe();
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
