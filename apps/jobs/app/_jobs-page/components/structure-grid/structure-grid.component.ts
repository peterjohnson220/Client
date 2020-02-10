import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import {Subscription} from 'rxjs';
import {ViewField} from 'libs/models/payfactors-api/reports/request';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';

import {Store} from '@ngrx/store';
import * as fromJobsPageReducer from '../../reducers';
import * as cloneDeep from 'lodash.clonedeep';

@Component({
  selector: 'pf-structure-grid',
  templateUrl: './structure-grid.component.html',
  styleUrls: ['./structure-grid.component.scss']
})
export class StructureGridComponent implements OnChanges, AfterViewInit, OnDestroy {
  pageViewId = '36FE36BF-A348-49DE-8511-B0DE46F52BDB';
  @Input() filters: PfDataGridFilter[];

  @ViewChild('nameColumn', { static: false }) nameColumn: ElementRef;
  @ViewChild('currencyColumn', { static: false }) currencyColumn: ElementRef;
  @ViewChild('payMarketFilter', { static: false }) payMarketFilter: ElementRef;

  colTemplates = {};
  globalFilterTemplates = {};
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Structures_Structure_Name'
  }];
  gridFieldSubscription: Subscription;
  companyPayMarketSubscription: Subscription;
  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  selectedPayMarket: any;



  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.companyPayMarketSubscription = this.store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });
    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket' && f.IsSelected === true);
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          {Value : this.payMarketField.FilterValue, Id : this.payMarketField.FilterValue} : null;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      const newFilter = [...this.filters];
      const jobFilter = newFilter.find(f => f.SourceName === 'CompanyJob_ID');
      if (jobFilter) {
        newFilter.splice(this.filters.indexOf(jobFilter), 1);
        newFilter.push({ ...jobFilter, SourceName: 'CompanyJobId' });
        this.filters = newFilter;
      }
    }
  }
  ngAfterViewInit() {
    this.globalFilterTemplates = {
      'PayMarket' : { Template: this.payMarketFilter }
    };
    this.colTemplates = {
      'Structure_Name': { Template: this.nameColumn },
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
