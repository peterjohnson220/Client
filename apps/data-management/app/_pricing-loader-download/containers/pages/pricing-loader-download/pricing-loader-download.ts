import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';

import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { SortDescriptor } from '@progress/kendo-data-query';

import { environment } from 'environments/environment';
import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models/security';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { ActionBarConfig, ColumnChooserType, getDefaultActionBarConfig } from 'libs/features/grids/pf-data-grid/models';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { ViewField } from 'libs/models/payfactors-api/reports/request';

import { JOB_PRICING_PAGEVIEW_ID } from '../../../constants';

@Component({
  selector: 'pf-pricing-loader-download',
  templateUrl: './pricing-loader-download.html',
  styleUrls: ['./pricing-loader-download.scss']
})

export class PricingLoaderDownloadComponent implements OnInit, OnDestroy , AfterViewInit {
  @ViewChild('recencyFilter', { static: false }) recencyFilter: ElementRef;

  private unsubscribe$ = new Subject();
  userContext: UserContext;
  userContext$: Observable<UserContext>;

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
  env = environment;

  constructor(private route: ActivatedRoute,
              private pfGridStore: Store<fromPfDataGridReducer.State>,
              private store: Store<fromRootState.State>) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);

    this.userContext$
      .pipe(
        filter(uc => !!uc),
        takeUntil(this.unsubscribe$)
      ).subscribe(userContext => {
        this.userContext = userContext;
        this.initPricing();
    });
  }
  ngOnInit() {}

  initPricing() {
    const queryParam = this.route.snapshot.queryParamMap;
    if (queryParam.keys.length > 0) {
      this.company = { Id: queryParam.get('companyId'), Name: queryParam.get('companyName') };
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
      ExportSourceName: (this.company.Name === null ? this.userContext.CompanyName : this.company.Name) + ' Pricings',
      CustomExportType: 'PricingNotes',
      ColumnChooserSubmitText: 'Refresh',
      ShowSelectAllColumns: true
    };
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  ngAfterViewInit() {
    this.filterTemplates = {
      'Recency': { Template: this.recencyFilter }
    };
  }

  updateField(field) {
    if (field.FilterValue) {
      this.pfGridStore.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.pfGridStore.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }
}
