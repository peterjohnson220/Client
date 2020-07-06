import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import * as cloneDeep from 'lodash.clonedeep';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';

import { environment } from 'environments/environment';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import { ActionBarConfig, ColumnChooserType, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import { ViewField } from 'libs/models/payfactors-api/reports/request';

import { JOB_PRICING_PAGEVIEW_ID } from '../../../constants';

@Component({
  selector: 'pf-pricing-loader-download',
  templateUrl: './pricing-loader-download.html',
  styleUrls: ['./pricing-loader-download.scss']
})

export class PricingLoaderDownloadComponent implements OnInit, AfterViewInit {
  @ViewChild('recencyFilter', { static: false }) recencyFilter: ElementRef;

  pageViewId = JOB_PRICING_PAGEVIEW_ID;
  gridFieldSubscription: Subscription;
  company = { Id: null, Name: null };
  filterTemplates = {};
  filters = [{
    SourceName: 'Linked_CompanyJobPricing_ID',
    Operator: 'isnull',
    Value: null
  },
  {
    SourceName: 'CompanyJobPricing_ID',
    Operator: 'notnull',
    Value: null
  }
  ];
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_PricingsMatches_CompanyJobPricing_ID'
  }];
  actionBarConfig: ActionBarConfig;
  selectedRecency: any;
  filteredRecencyOptions = [
    {
      Id: 1,
      Value: 'Most Recent'
    }
  ];
  recencyField: ViewField;
  fieldsExcludedFromExport = ['Recency'];
  env = environment;

  constructor(private route: ActivatedRoute,
    private pfGridStore: Store<fromPfDataGridReducer.State>) {
    this.gridFieldSubscription = this.pfGridStore.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.recencyField = fields.find(f => f.SourceName === 'Recency');
        this.selectedRecency = this.recencyField.FilterValue !== null ?
          {
            Value: this.filteredRecencyOptions.find(r => r.Id === parseInt(this.recencyField.FilterValue, 0)).Value,
            Id: this.recencyField.FilterValue
          } : null;
      }
    });

  }

  ngOnInit() {
    const queryParam = this.route.snapshot.queryParamMap;
    if (queryParam.keys.length > 0) {
      this.company = { Id: queryParam.get('company').split('-')[0], Name: queryParam.get('company').split('-')[1] };
      this.filters.push({
        SourceName: 'Company_ID',
        Operator: '=',
        Value: this.company.Id
      });
    }
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true,
      AllowExport: true,
      ExportSourceName: this.company.Name + ' Pricings',
      CustomExportType: 'PricingNotes',
      ColumnChooserSubmitText: 'Refresh',
      ShowSelectAllColumns: true
    };
  }

  ngAfterViewInit() {
    this.filterTemplates = {
      'Recency': { Template: this.recencyFilter }
    };
  }

  handleRecencyFilterChanged(value: any) {
    const field = cloneDeep(this.recencyField);
    field.FilterValue = value.Id;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  updateField(field) {
    if (field.FilterValue) {
      this.pfGridStore.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.pfGridStore.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }
}
